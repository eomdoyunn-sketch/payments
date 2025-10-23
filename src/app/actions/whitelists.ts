'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// =====================================================
// Whitelists (추첨 명단) 관리 Server Actions
// =====================================================

export type WhitelistEntry = {
  id: string
  company_code: string
  product_type: 'fullDay' | 'morning' | 'evening'
  employee_id?: string | null  // Optional: 사번 없이 이름만으로 검증
  name: string
  created_at: string
}

// 인증 체크 헬퍼 함수 (권한 체크 제거)
async function checkAuthentication() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')

  return { supabase, user }
}

// 화이트리스트 조회
export async function getWhitelist(
  companyCode: string,
  productType: 'fullDay' | 'morning' | 'evening'
): Promise<WhitelistEntry[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('whitelists')
      .select('*')
      .eq('company_code', companyCode)
      .eq('product_type', productType)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching whitelist:', error)
      throw new Error('화이트리스트 조회에 실패했습니다')
    }

    return data || []
  } catch (error) {
    console.error('getWhitelist error:', error)
    // 테이블이 없는 경우 빈 배열 반환
    return []
  }
}

// 화이트리스트 일괄 업로드 (기존 데이터 삭제 후 새로 추가)
// 사번 없이 이름만으로 업로드
export async function uploadWhitelist(
  companyCode: string,
  productType: 'fullDay' | 'morning' | 'evening',
  names: Array<string>  // 이름 배열만 받음
) {
  try {
    const { supabase } = await checkAuthentication()

    // 기존 데이터 삭제
    await supabase
      .from('whitelists')
      .delete()
      .eq('company_code', companyCode)
      .eq('product_type', productType)

    // 새 데이터가 없으면 삭제만 하고 종료
    if (!names || names.length === 0) {
      revalidatePath('/admin')
      return { success: true, count: 0 }
    }

    // 새 데이터 삽입 (사번 없이 이름만)
    const whitelistData = names.map(name => ({
      company_code: companyCode,
      product_type: productType,
      employee_id: null,  // 사번 불필요 (이제 null 허용)
      name: name.trim(),
    }))

    const { data, error } = await supabase
      .from('whitelists')
      .insert(whitelistData)
      .select()

    if (error) {
      console.error('Error uploading whitelist:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`화이트리스트 업로드에 실패했습니다: ${error.message}`)
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true, count: data.length }
  } catch (error) {
    console.error('uploadWhitelist error:', error)
    throw error
  }
}

// 화이트리스트 삭제 (특정 계열사 + 상품 타입)
export async function deleteWhitelist(
  companyCode: string,
  productType: 'fullDay' | 'morning' | 'evening'
) {
  try {
    const { supabase } = await checkAuthentication()

    const { error } = await supabase
      .from('whitelists')
      .delete()
      .eq('company_code', companyCode)
      .eq('product_type', productType)

    if (error) {
      console.error('Error deleting whitelist:', error)
      throw new Error('화이트리스트 삭제에 실패했습니다')
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('deleteWhitelist error:', error)
    throw error
  }
}

// 화이트리스트 확인 (결제 시 사용 - 이름만으로 검증)
export async function checkWhitelist(
  companyCode: string,
  productType: 'fullDay' | 'morning' | 'evening',
  name: string  // 사번 대신 이름으로 검증
): Promise<{ isWhitelisted: boolean; entry?: WhitelistEntry }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('whitelists')
      .select('*')
      .eq('company_code', companyCode)
      .eq('product_type', productType)
      .eq('name', name.trim())
      .maybeSingle()

    if (error) {
      console.error('Error checking whitelist:', error)
      return { isWhitelisted: false }
    }

    return {
      isWhitelisted: !!data,
      entry: data || undefined,
    }
  } catch (error) {
    console.error('checkWhitelist error:', error)
    // 테이블이 없거나 에러 발생 시 false 반환
    return { isWhitelisted: false }
  }
}

// 화이트리스트 개별 항목 추가 (사번 없이 이름만)
export async function addWhitelistEntry(
  companyCode: string,
  productType: 'fullDay' | 'morning' | 'evening',
  name: string
) {
  try {
    const { supabase } = await checkAuthentication()

    const { data, error } = await supabase
      .from('whitelists')
      .insert({
        company_code: companyCode,
        product_type: productType,
        employee_id: null,  // 사번 불필요 (이제 null 허용)
        name: name.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding whitelist entry:', error)
      throw new Error('화이트리스트 항목 추가에 실패했습니다')
    }

    revalidatePath('/admin')
    return data
  } catch (error) {
    console.error('addWhitelistEntry error:', error)
    throw error
  }
}

// 화이트리스트 개별 항목 삭제
export async function removeWhitelistEntry(entryId: string) {
  try {
    const { supabase } = await checkAuthentication()

    const { error } = await supabase
      .from('whitelists')
      .delete()
      .eq('id', entryId)

    if (error) {
      console.error('Error removing whitelist entry:', error)
      throw new Error('화이트리스트 항목 삭제에 실패했습니다')
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('removeWhitelistEntry error:', error)
    throw error
  }
}

// 화이트리스트 통계 조회
export async function getWhitelistStats(companyCode: string) {
  try {
    const { supabase } = await checkAuthentication()

    const { data, error } = await supabase
      .from('whitelists')
      .select('product_type')
      .eq('company_code', companyCode)

    if (error) {
      console.error('Error fetching whitelist stats:', error)
      throw new Error('화이트리스트 통계 조회에 실패했습니다')
    }

    const stats = {
      fullDayCount: data?.filter(w => w.product_type === 'fullDay').length || 0,
      morningCount: data?.filter(w => w.product_type === 'morning').length || 0,
      eveningCount: data?.filter(w => w.product_type === 'evening').length || 0,
      totalCount: data?.length || 0,
    }

    return stats
  } catch (error) {
    console.error('getWhitelistStats error:', error)
    return {
      fullDayCount: 0,
      morningCount: 0,
      eveningCount: 0,
      totalCount: 0,
    }
  }
}

// 모든 화이트리스트 조회 (관리자용)
export async function getAllWhitelists(): Promise<WhitelistEntry[]> {
  try {
    const { supabase } = await checkAuthentication()

    const { data, error } = await supabase
      .from('whitelists')
      .select('*')
      .order('company_code', { ascending: true })
      .order('product_type', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching all whitelists:', error)
      throw new Error('전체 화이트리스트 조회에 실패했습니다')
    }

    return data || []
  } catch (error) {
    console.error('getAllWhitelists error:', error)
    return []
  }
}

