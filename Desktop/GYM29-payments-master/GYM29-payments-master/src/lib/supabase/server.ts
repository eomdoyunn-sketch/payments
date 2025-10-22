import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  // Supabase 프로젝트 설정 (gym29-payments) - 하드코딩된 값 사용
  const supabaseUrl = 'https://pgcmozwsjzsbroayfcny.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnY21vendzanpzYnJvYXlmY255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTE5ODQsImV4cCI6MjA3NTY4Nzk4NH0.ONAJxgp93e5gqIzQWhte2_E1IRXAgoLY_ieBnXuUhTU'

  console.log('🔧 Supabase 서버 클라이언트 설정:', { supabaseUrl, hasAnonKey: !!supabaseAnonKey })

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


