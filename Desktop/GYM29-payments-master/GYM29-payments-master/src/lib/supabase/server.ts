import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Supabase 설정 - 환경변수 또는 하드코딩된 값 사용
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ouucwiaylephariimyrq.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dWN3aWF5bGVwaGFyaWlteXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTIxODksImV4cCI6MjA3NjY2ODE4OX0.NaxXIzvO01nrAQWYjl9uAdqK_Xod-mdCGdOVOLNcNTY'

  console.log('🔧 Supabase 서버 클라이언트 설정:', { supabaseUrl, hasAnonKey: !!supabaseAnonKey })

  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}


