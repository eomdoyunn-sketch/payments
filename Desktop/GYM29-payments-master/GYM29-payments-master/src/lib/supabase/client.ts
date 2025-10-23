import { createBrowserClient } from '@supabase/ssr'
import { clearAuthTokens } from '@/lib/auth-utils'

export function createClient() {
  // Supabase 설정 - 환경변수 또는 하드코딩된 값 사용
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ouucwiaylephariimyrq.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dWN3aWF5bGVwaGFyaWlteXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTIxODksImV4cCI6MjA3NjY2ODE4OX0.NaxXIzvO01nrAQWYjl9uAdqK_Xod-mdCGdOVOLNcNTY'
  
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
    return null as any
  }
}


