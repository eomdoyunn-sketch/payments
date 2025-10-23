/**
 * 기존 사용자의 이메일 확인 상태를 업데이트하는 유틸리티
 */

import { createClient } from '@/lib/supabase/server'

export async function fixEmailConfirmation(email: string) {
  try {
    const supabase = await createClient()
    
    // 사용자 정보 조회
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('사용자 목록 조회 오류:', listError)
      return { success: false, error: listError.message }
    }
    
    // 해당 이메일의 사용자 찾기
    const user = users.find(u => u.email === email)
    
    if (!user) {
      return { success: false, error: '사용자를 찾을 수 없습니다.' }
    }
    
    // 이메일 확인 상태 업데이트
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true
    })
    
    if (error) {
      console.error('이메일 확인 상태 업데이트 오류:', error)
      return { success: false, error: error.message }
    }
    
    console.log('이메일 확인 상태 업데이트 성공:', email)
    return { success: true, data }
    
  } catch (error) {
    console.error('이메일 확인 상태 수정 중 오류:', error)
    return { success: false, error: '이메일 확인 상태 수정 중 오류가 발생했습니다.' }
  }
}
