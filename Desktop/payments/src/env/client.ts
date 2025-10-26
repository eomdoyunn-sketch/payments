/**
 * 클라이언트 전용 환경변수 검증 및 로드
 * NEXT_PUBLIC_ 접두사가 붙은 변수만 접근 가능합니다.
 */

/**
 * 클라이언트에서 접근 가능한 환경변수
 * NEXT_PUBLIC_ 접두사가 붙은 변수만 포함됩니다.
 */
export function getClientEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  // 필수 환경변수 검증
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '클라이언트 환경변수가 설정되지 않았습니다. .env.local을 확인해주세요.\n' +
      '필수: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  // URL 형식 검증
  try {
    const urlObj = new URL(supabaseUrl)
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL 프로토콜이 올바르지 않습니다.')
    }
  } catch (error) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL이 올바른 URL 형식이 아닙니다.')
  }

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
    NEXT_PUBLIC_APP_URL: appUrl || 'http://localhost:3000',
  } as const
}

/**
 * 안전하게 클라이언트 환경변수를 가져옵니다.
 * 값이 없어도 오류를 던지지 않습니다.
 */
export function getClientEnvOptional() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  } as const
}
