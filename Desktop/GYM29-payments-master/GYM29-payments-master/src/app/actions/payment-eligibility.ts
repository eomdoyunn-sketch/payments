'use server'

import { createClient } from '@/lib/supabase/server'

// 결제 자격 검증 결과 타입
export type PaymentEligibility = {
  eligible: boolean
  reason?: string
  company?: {
    code: string
    name: string
    status: 'active' | 'inactive'
    mode: 'FCFS' | 'WHL'
    quota: {
      fullDay: number
      morning: number
      evening: number
    }
  }
  userInfo?: {
    name: string
    employee_id: string
    company_code: string
    company_name: string
  }
  whitelistProducts?: Array<'fullDay' | 'morning' | 'evening'>
}

/**
 * 로그인한 사용자의 결제 자격 검증
 * - 사용자 정보 조회
 * - 계열사 정보 조회
 * - 계열사 상태 확인 (active/inactive)
 * - WHL 모드인 경우 추첨 명단 확인
 */
export async function checkPaymentEligibility(): Promise<PaymentEligibility> {
  try {
    // Supabase URL이 유효하지 않은 경우 기본 응답 반환
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || 
        !supabaseAnonKey || 
        supabaseUrl === 'your_supabase_project_url' || 
        supabaseUrl === 'https://dummy.supabase.co' ||
        supabaseAnonKey === 'your_supabase_anon_key' ||
        supabaseAnonKey === 'dummy-key') {
      console.log('📊 Supabase 설정 없음, 결제 자격 검증 건너뜀')
      return {
        eligible: true,
        reason: '개발 모드: Supabase 설정 없음'
      }
    }

    // Supabase 클라이언트 생성 시도
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.log('📊 Supabase 클라이언트 생성 실패, 기본 응답 반환:', clientError)
      return {
        eligible: true,
        reason: '개발 모드: Supabase 연결 실패'
      }
    }

    // 1. 현재 로그인한 사용자 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return {
        eligible: false,
        reason: '로그인이 필요합니다.'
      }
    }

    // 2. user_profiles에서 사용자 상세 정보 조회
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('name, employee_id, company_code, company_name')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return {
        eligible: false,
        reason: '사용자 프로필 정보를 찾을 수 없습니다.'
      }
    }

    // 3. 계열사 정보 조회
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('code, name, status, mode, quota')
      .eq('code', profile.company_code)
      .single()

    if (companyError || !company) {
      return {
        eligible: false,
        reason: '계열사 정보를 찾을 수 없습니다.',
        userInfo: profile
      }
    }

    // 4. 계열사 상태 확인
    if (company.status !== 'active') {
      return {
        eligible: false,
        reason: '현재 해당 계열사는 등록이 비활성화되어 있습니다.',
        company: company as any,
        userInfo: profile
      }
    }

    // 5. WHL(추첨) 모드인 경우 명단 확인 (계열사 + 이름만으로 검증)
    if (company.mode === 'WHL') {
      const { data: whitelistEntries, error: whitelistError } = await supabase
        .from('whitelists')
        .select('product_type')
        .eq('company_code', profile.company_code)
        .eq('name', profile.name)  // 사번 없이 이름만으로 검증

      if (whitelistError) {
        console.error('Whitelist check error:', whitelistError)
      }

      const whitelistProducts = (whitelistEntries || []).map(entry => entry.product_type as 'fullDay' | 'morning' | 'evening')

      if (whitelistProducts.length === 0) {
        return {
          eligible: false,
          reason: '추첨 명단에 등록되어 있지 않습니다. 계열사 담당자에게 문의하세요.',
          company: company as any,
          userInfo: profile,
          whitelistProducts: []
        }
      }

      // 추첨 명단에 있는 경우 - 해당 상품만 구매 가능
      return {
        eligible: true,
        company: company as any,
        userInfo: profile,
        whitelistProducts
      }
    }

    // 6. FCFS(선착순) 모드인 경우 - 모든 상품 구매 가능
    return {
      eligible: true,
      company: company as any,
      userInfo: profile,
      whitelistProducts: ['fullDay', 'morning', 'evening']
    }

  } catch (error) {
    console.error('Payment eligibility check error:', error)
    return {
      eligible: false,
      reason: '결제 자격 확인 중 오류가 발생했습니다.'
    }
  }
}

/**
 * 특정 상품에 대한 결제 자격 확인
 * @param productType - 'fullDay' | 'morning' | 'evening'
 */
export async function checkProductEligibility(
  productType: 'fullDay' | 'morning' | 'evening'
): Promise<{ eligible: boolean; reason?: string }> {
  const eligibility = await checkPaymentEligibility()

  if (!eligibility.eligible) {
    return {
      eligible: false,
      reason: eligibility.reason
    }
  }

  // WHL 모드인 경우 해당 상품이 whitelist에 있는지 확인
  if (eligibility.company?.mode === 'WHL') {
    if (!eligibility.whitelistProducts?.includes(productType)) {
      return {
        eligible: false,
        reason: `해당 상품(${productType})은 추첨 명단에 포함되지 않았습니다.`
      }
    }
  }

  return {
    eligible: true
  }
}

/**
 * 계열사별 등록 현황 조회 (할당량 대비 등록 인원)
 */
export async function getCompanyRegistrationStatus(companyCode: string) {
  const supabase = await createClient()

  try {
    // 등록된 인원 카운트
    const { count: registeredCount, error: countError } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('company_code', companyCode)

    if (countError) {
      console.error('Count error:', countError)
      return null
    }

    // 계열사 정보 조회
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('name, quota')
      .eq('code', companyCode)
      .single()

    if (companyError || !company) {
      return null
    }

    const quota = company.quota as { fullDay: number; morning: number; evening: number }
    const totalQuota = quota.fullDay + quota.morning + quota.evening

    return {
      companyName: company.name,
      registered: registeredCount || 0,
      totalQuota,
      remaining: totalQuota - (registeredCount || 0),
      quota
    }
  } catch (error) {
    console.error('Registration status error:', error)
    return null
  }
}

