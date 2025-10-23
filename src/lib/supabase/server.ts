import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { validateSupabaseEnv } from '@/lib/env'

export async function createClient() {
  try {
    const { url, key } = validateSupabaseEnv()
    const cookieStore = await cookies()

    return createServerClient(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Server Component에서 호출된 경우 무시
            console.warn('쿠키 설정 중 오류 (무시됨):', error)
          }
        },
      },
    })
  } catch (error) {
    console.error('❌ Supabase 서버 클라이언트 생성 실패:', error)
    throw error
  }
}


