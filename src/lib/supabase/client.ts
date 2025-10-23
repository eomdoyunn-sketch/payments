import { createBrowserClient } from '@supabase/ssr'
import { clearAuthTokens } from '@/lib/auth-utils'
import { validateSupabaseEnv } from '@/lib/env'

export function createClient() {
  try {
    const { url, key } = validateSupabaseEnv()
    
    console.log('🔧 Supabase 클라이언트 설정:', { url, hasKey: !!key })
    
    const client = createBrowserClient(url, key)
    
    // 연결 테스트
    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.warn('Supabase 초기 연결 테스트 실패:', error.message)
      } else {
        console.log('Supabase 클라이언트 초기화 성공')
      }
    }).catch(err => {
      console.error('Supabase 클라이언트 초기화 중 오류:', err)
    })
    
    // 인증 상태 변화 감지 및 처리
    client.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('사용자 로그인:', session?.user?.email)
          break
          
        case 'SIGNED_OUT':
          console.log('사용자 로그아웃')
          clearAuthTokens()
          break
          
        case 'TOKEN_REFRESHED':
          if (!session) {
            console.warn('토큰 갱신 실패 - 사용자 세션이 만료되었습니다.')
            clearAuthTokens()
          } else {
            console.log('토큰 갱신 성공')
          }
          break
          
        case 'USER_UPDATED':
          console.log('사용자 정보 업데이트:', session?.user?.email)
          break
          
        case 'PASSWORD_RECOVERY':
          console.log('비밀번호 복구 요청')
          break
      }
    })
    
    return client
  } catch (error) {
    console.error('❌ Supabase 클라이언트 생성 실패:', error)
    throw error
  }
}


