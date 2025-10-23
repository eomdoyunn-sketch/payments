/**
 * 인증 관련 유틸리티 함수들
 */

/**
 * 로컬 스토리지에서 Supabase 인증 토큰을 정리합니다.
 */
export function clearAuthTokens() {
  if (typeof window === 'undefined') return
  
  try {
    // Supabase 관련 모든 토큰 제거
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('sb-') && key.includes('auth-token')) {
        localStorage.removeItem(key)
      }
    })
    
    // 추가로 알려진 토큰 키들도 제거
    localStorage.removeItem('sb-pgcmozwsjzsbroayfcny-auth-token')
    localStorage.removeItem('supabase.auth.token')
    
    console.log('인증 토큰이 정리되었습니다.')
  } catch (error) {
    console.error('토큰 정리 중 오류:', error)
  }
}

/**
 * Refresh token 오류인지 확인합니다.
 */
export function isRefreshTokenError(error: any): boolean {
  if (!error || !error.message) return false
  
  const message = error.message.toLowerCase()
  return message.includes('refresh token not found') || 
         message.includes('invalid refresh token') ||
         message.includes('refresh token expired')
}

/**
 * 인증 오류를 안전하게 처리합니다.
 */
export function handleAuthError(error: any): void {
  console.warn('인증 오류 발생:', error.message)
  
  if (isRefreshTokenError(error)) {
    console.log('Refresh token 오류로 인한 자동 로그아웃 처리')
    clearAuthTokens()
    
    // 페이지 새로고침으로 상태 초기화
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}

/**
 * Supabase 클라이언트가 유효한지 확인합니다.
 */
export function isValidSupabaseClient(client: any): boolean {
  return client && 
         typeof client.auth === 'object' && 
         typeof client.auth.getSession === 'function'
}
