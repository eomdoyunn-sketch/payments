import { createBrowserClient } from '@supabase/ssr'
import { clearAuthTokens } from '@/lib/auth-utils'
import { validateSupabaseEnv } from '@/lib/env'

// 클라이언트 인스턴스 캐싱
let clientInstance: ReturnType<typeof createBrowserClient> | null = null
let isInitialized = false

export function createClient() {
  // 이미 초기화된 클라이언트가 있으면 재사용
  if (clientInstance && isInitialized) {
    return clientInstance
  }

  try {
    const { url, key } = validateSupabaseEnv()
    
    // 개발 환경에서만 상세 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Supabase 클라이언트 설정:', { url, hasKey: !!key })
    }
    
    const client = createBrowserClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      },
      global: {
        fetch: async (url, options = {}) => {
          const maxRetries = 3
          let lastError: Error | null = null
          
          for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
              // Headers 병합 시, Headers 객체를 안전하게 보존해야 apikey 등 내부 헤더가 유지됩니다.
              const mergedHeaders = new Headers(options.headers as HeadersInit)
              mergedHeaders.set('Cache-Control', 'no-cache')

              const response = await fetch(url, {
                ...options,
                headers: mergedHeaders,
              })
              
              if (response.ok) {
                return response
              }
              
              // 4xx 클라이언트 오류는 재시도하지 않고 바로 반환
              if (response.status >= 400 && response.status < 500) {
                console.warn(`Client error: ${response.status}`, url)
                return response
              }
              
              // 5xx 서버 오류만 재시도
              if (response.status >= 500) {
                console.warn(`Server error: ${response.status}, attempt ${attempt}/${maxRetries}`)
                
                if (attempt < maxRetries) {
                  // 지수 백오프: 1초, 2초, 4초
                  const delay = Math.pow(2, attempt - 1) * 1000
                  await new Promise(resolve => setTimeout(resolve, delay))
                  continue
                }
                
                throw new Error(`Server error: ${response.status}`)
              }
              
              return response
            } catch (error) {
              lastError = error as Error
              
              if (attempt < maxRetries) {
                console.warn(`Supabase fetch attempt ${attempt} failed:`, error)
                // 지수 백오프: 1초, 2초, 4초
                const delay = Math.pow(2, attempt - 1) * 1000
                await new Promise(resolve => setTimeout(resolve, delay))
              }
            }
          }
          
          console.error('Supabase fetch failed after all retries:', lastError)
          throw lastError || new Error('Network request failed')
        }
      }
    })
    
    // 연결 테스트 (한 번만 실행)
    if (!isInitialized) {
      client.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.warn('Supabase 초기 연결 테스트 실패:', error.message)
        } else {
          console.log('Supabase 클라이언트 초기화 성공')
        }
      }).catch(err => {
        console.error('Supabase 클라이언트 초기화 중 오류:', err)
      })
      
      // 인증 상태 변화 감지 및 처리 (한 번만 등록)
      client.auth.onAuthStateChange((event, session) => {
        // 개발 환경에서만 상세 로그
        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state changed:', event, session?.user?.email)
        }
        
        switch (event) {
          case 'SIGNED_IN':
            console.log('사용자 로그인:', session?.user?.email)
            break
            
          case 'SIGNED_OUT':
            console.log('사용자 로그아웃 또는 세션 만료')
            clearAuthTokens()
            // 페이지 새로고침으로 로그인 페이지로 리다이렉트
            if (typeof window !== 'undefined') {
              window.location.href = '/login'
            }
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
      
      isInitialized = true
    }
    
    clientInstance = client
    return client
  } catch (error) {
    console.error('❌ Supabase 클라이언트 생성 실패:', error)
    throw error
  }
}


