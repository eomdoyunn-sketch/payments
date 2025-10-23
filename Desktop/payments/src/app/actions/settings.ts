'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { DEFAULT_SETTINGS, type GlobalSettings } from '@/lib/default-settings'

// =====================================================
// Settings (전역 설정) 관리 Server Actions
// =====================================================

// 인증 체크 헬퍼 함수 (권한 체크 제거)
async function checkAuthentication() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')

  return { supabase, user }
}

// 전역 설정 조회 (모든 인증된 사용자 접근 가능)
export async function getGlobalSettings(): Promise<GlobalSettings> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching settings:', error)
      // 에러 발생 시 기본값 반환
      return DEFAULT_SETTINGS
    }

    // 데이터가 없으면 기본값 반환
    if (!data || !data.data) {
      console.log('📊 전역 설정 데이터 없음, 기본값 사용:', DEFAULT_SETTINGS.membershipPrices)
      return DEFAULT_SETTINGS
    }

    // 기본값과 병합 (누락된 필드 방지)
    const mergedSettings = {
      ...DEFAULT_SETTINGS,
      ...data.data,
      membershipPrices: {
        ...DEFAULT_SETTINGS.membershipPrices,
        ...(data.data.membershipPrices || {}),
      },
      membershipPeriod: data.data.membershipPeriod ?? DEFAULT_SETTINGS.membershipPeriod,
      productStatus: {
        memberships: {
          ...DEFAULT_SETTINGS.productStatus.memberships,
          ...(data.data.productStatus?.memberships || {}),
        },
        locker: data.data.productStatus?.locker ?? DEFAULT_SETTINGS.productStatus.locker,
      },
      registrationPeriod: {
        ...DEFAULT_SETTINGS.registrationPeriod,
        ...(data.data.registrationPeriod || {}),
      },
      companyAgreements: {
        global: {
          ...DEFAULT_SETTINGS.companyAgreements.global,
          ...(data.data.companyAgreements?.global || {}),
        },
        companies: data.data.companyAgreements?.companies || {},
      },
    }
    
    console.log('📊 전역 설정 로드됨:', {
      rawData: data.data.membershipPrices,
      mergedPrices: mergedSettings.membershipPrices
    })
    
    return mergedSettings
  } catch (error) {
    console.error('getGlobalSettings error:', error)
    // 테이블이 없는 경우 기본값 반환
    return DEFAULT_SETTINGS
  }
}

// 전역 설정 저장 (관리자만)
export async function saveGlobalSettings(settings: GlobalSettings) {
  try {
    // Supabase 클라이언트 생성 시 에러 핸들링
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('Supabase 클라이언트 생성 실패:', clientError)
      return { error: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' }
    }

    // 인증 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { error: '인증이 필요합니다' }
    }

    console.log('💾 전역 설정 저장 시작:', settings.membershipPrices)

    // 기존 설정 확인
    const { data: existing, error: fetchError } = await supabase
      .from('settings')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      console.error('설정 조회 오류:', fetchError)
      return { error: '설정 조회에 실패했습니다' }
    }

    let result
    if (existing) {
      // 업데이트
      console.log('📝 기존 설정 업데이트:', existing.id)
      const { data, error } = await supabase
        .from('settings')
        .update({ data: settings })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating settings:', error)
        return { error: '설정 업데이트에 실패했습니다' }
      }
      result = data
      console.log('✅ 설정 업데이트 완료:', data)
    } else {
      // 신규 생성
      console.log('🆕 새 설정 생성')
      const { data, error } = await supabase
        .from('settings')
        .insert({ data: settings })
        .select()
        .single()

      if (error) {
        console.error('Error creating settings:', error)
        return { error: '설정 생성에 실패했습니다' }
      }
      result = data
      console.log('✅ 설정 생성 완료:', data)
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('saveGlobalSettings error:', error)
    
    // 네트워크 오류인 경우 특별 처리
    if (error instanceof Error && error.message.includes('fetch')) {
      return { error: '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.' }
    }
    
    return { error: '설정 저장 중 오류가 발생했습니다.' }
  }
}

// 설정 초기화 (관리자만)
export async function resetSettings() {
  try {
    const { supabase } = await checkAuthentication()

    // 기존 설정 확인
    const { data: existing } = await supabase
      .from('settings')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) {
      // 기본값으로 업데이트
      const { data, error } = await supabase
        .from('settings')
        .update({ data: DEFAULT_SETTINGS })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error resetting settings:', error)
        throw new Error('설정 초기화에 실패했습니다')
      }

      revalidatePath('/admin')
      revalidatePath('/')
      return data
    } else {
      // 신규 생성
      const { data, error } = await supabase
        .from('settings')
        .insert({ data: DEFAULT_SETTINGS })
        .select()
        .single()

      if (error) {
        console.error('Error creating default settings:', error)
        throw new Error('기본 설정 생성에 실패했습니다')
      }

      revalidatePath('/admin')
      revalidatePath('/')
      return data
    }
  } catch (error) {
    console.error('resetSettings error:', error)
    throw error
  }
}

// 특정 설정 부분만 업데이트 (관리자만)
export async function updateSettingsPartial(updates: Partial<GlobalSettings>) {
  try {
    const { supabase } = await checkAuthentication()

    // 현재 설정 가져오기
    const currentSettings = await getGlobalSettings()

    // 병합
    const mergedSettings: GlobalSettings = {
      ...currentSettings,
      ...updates,
      membershipPrices: {
        ...currentSettings.membershipPrices,
        ...(updates.membershipPrices || {}),
      },
      membershipPeriod: updates.membershipPeriod ?? currentSettings.membershipPeriod,
      productStatus: updates.productStatus
        ? {
            memberships: {
              ...currentSettings.productStatus.memberships,
              ...(updates.productStatus.memberships || {}),
            },
            locker: updates.productStatus.locker ?? currentSettings.productStatus.locker,
          }
        : currentSettings.productStatus,
      registrationPeriod: {
        ...currentSettings.registrationPeriod,
        ...(updates.registrationPeriod || {}),
      },
      companyAgreements: updates.companyAgreements
        ? {
            global: {
              ...currentSettings.companyAgreements.global,
              ...(updates.companyAgreements.global || {}),
            },
            companies: {
              ...currentSettings.companyAgreements.companies,
              ...(updates.companyAgreements.companies || {}),
            },
          }
        : currentSettings.companyAgreements,
    }

    // 저장
    return await saveGlobalSettings(mergedSettings)
  } catch (error) {
    console.error('updateSettingsPartial error:', error)
    throw error
  }
}

