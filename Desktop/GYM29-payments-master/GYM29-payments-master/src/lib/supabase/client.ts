import { createBrowserClient } from '@supabase/ssr'
import { clearAuthTokens } from '@/lib/auth-utils'

export function createClient() {
  // Supabase 프로젝트 설정 (gym29-payments) - 하드코딩된 값 사용
  const supabaseUrl = 'https://pgcmozwsjzsbroayfcny.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnY21vendzanpzYnJvYXlmY255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTE5ODQsImV4cCI6MjA3NTY4Nzk4NH0.ONAJxgp93e5gqIzQWhte2_E1IRXAgoLY_ieBnXuUhTU'
  
  console.log('🔧 Supabase 클라이언트 설정:', { supabaseUrl, hasAnonKey: !!supabaseAnonKey })
  
  try {
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey)
    
    // 클라이언트에 오류 핸들러 추가
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.warn('토큰 갱신 실패 - 사용자 세션이 만료되었습니다.')
        clearAuthTokens()
      }
    })
    
    return client
  } catch (error) {
    console.error('❌ Supabase 클라이언트 생성 실패:', error)
    // Supabase 없이도 결제 테스트가 가능하도록 임시 처리
    return null as any
  }
}


