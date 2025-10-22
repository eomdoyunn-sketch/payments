'use server'

import { createClient } from '@/lib/supabase/server'

// 계열사 목록 조회
export async function getActiveCompanies() {
  try {
    const supabase = await createClient()

    const { data: companies, error } = await supabase
      .from('companies')
      .select('code, name, status')
      .eq('status', 'active')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching companies:', error)
      return []
    }

    console.log('Companies fetched:', companies) // 디버깅용 로그
    return companies || []
  } catch (err) {
    console.error('Exception in getActiveCompanies:', err)
    return []
  }
}

// 특정 계열사 정보 조회
export async function getCompanyByCode(code: string) {
  const supabase = await createClient()

  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('code', code)
    .single()

  if (error) {
    console.error('Error fetching company:', error)
    return null
  }

  return company
}

// 계열사별 등록 현황 조회 (실시간)
export async function getCompanyRegistrationStats() {
  const supabase = await createClient()

  // 모든 계열사 조회
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('code, name, status')
    .order('code', { ascending: true })

  if (companiesError) {
    console.error('Error fetching companies:', companiesError)
    return []
  }

  // 계열사별 등록 인원 카운트
  const stats = await Promise.all(
    (companies || []).map(async (company) => {
      const { count, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('company_code', company.code)

      if (error) {
        console.error(`Error counting users for ${company.code}:`, error)
        return {
          ...company,
          registered: 0,
        }
      }

      return {
        ...company,
        registered: count || 0,
      }
    })
  )

  return stats
}

// =====================================================
// 관리자 전용 Server Actions
// =====================================================

// 모든 계열사 조회 (관리자용 - 상세 정보 포함)
export async function getAllCompanies() {
  const supabase = await createClient()

  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
    .order('code', { ascending: true })

  if (error) {
    console.error('Error fetching all companies:', error)
    throw new Error('계열사 조회에 실패했습니다')
  }

  return companies || []
}

// 계열사 생성
export async function createCompany(companyData: {
  code: string
  name: string
  quota?: { fullDay: number; morning: number; evening: number }
  mode?: 'FCFS' | 'WHL'
  status?: 'active' | 'inactive'
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
}) {
  const supabase = await createClient()

  // 인증 체크 (권한 체크 제거)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')

  // 기본값 설정
  const quota = companyData.quota || { fullDay: 0, morning: 0, evening: 0 }
  const allocatedTotal = quota.fullDay + quota.morning + quota.evening

  const { data, error } = await supabase
    .from('companies')
    .insert({
      code: companyData.code,
      name: companyData.name,
      status: companyData.status || 'active'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating company:', error)
    throw new Error('계열사 추가에 실패했습니다')
  }

  return data
}

// 계열사 수정
export async function updateCompany(
  code: string,
  updates: Partial<{
    name: string
    quota: { fullDay: number; morning: number; evening: number }
    mode: 'FCFS' | 'WHL'
    status: 'active' | 'inactive'
    contactPerson: string
    contactEmail: string
    contactPhone: string
  }>
) {
  const supabase = await createClient()

  // 인증 체크 (권한 체크 제거)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')

  // 업데이트할 데이터 준비
  const updateData: Record<string, any> = {}
  if (updates.name) updateData.name = updates.name
  if (updates.status) updateData.status = updates.status
  if (updates.mode) updateData.mode = updates.mode
  if (updates.quota) updateData.quota = updates.quota

  const { data, error } = await supabase
    .from('companies')
    .update(updateData)
    .eq('code', code)
    .select()
    .single()

  if (error) {
    console.error('Error updating company:', error)
    throw new Error('계열사 수정에 실패했습니다')
  }

  return data
}

// 계열사 삭제
export async function deleteCompany(code: string) {
  const supabase = await createClient()

  // 인증 체크 (권한 체크 제거)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')

  // 해당 계열사에 등록된 사용자가 있는지 확인
  const { count } = await supabase
    .from('user_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('company_code', code)

  if (count && count > 0) {
    throw new Error('등록된 사용자가 있어 삭제할 수 없습니다')
  }

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('code', code)

  if (error) {
    console.error('Error deleting company:', error)
    throw new Error('계열사 삭제에 실패했습니다')
  }

  return { success: true }
}

// 계열사 상태 토글
export async function toggleCompanyStatus(code: string, status: 'active' | 'inactive') {
  const supabase = await createClient()

  // 인증 체크 (권한 체크 제거)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')

  const { data, error } = await supabase
    .from('companies')
    .update({ status })
    .eq('code', code)
    .select()
    .single()

  if (error) {
    console.error('Error toggling company status:', error)
    throw new Error('계열사 상태 변경에 실패했습니다')
  }

  return data
}

