/**
 * Supabase 연결 테스트 유틸리티
 */

import { createClient } from './supabase/client'

export async function testSupabaseConnection() {
  try {
    const supabase = createClient()
    
    // 간단한 연결 테스트
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Supabase 연결 오류:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Supabase 연결 성공')
    return { success: true, data }
    
  } catch (error) {
    console.error('Supabase 연결 테스트 중 오류:', error)
    return { success: false, error: 'Supabase 연결에 실패했습니다.' }
  }
}
