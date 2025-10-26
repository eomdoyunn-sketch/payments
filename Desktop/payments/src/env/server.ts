/**
 * 서버 전용 환경변수 검증 및 로드
 * 클라이언트 번들에 포함되지 않습니다.
 */

/**
 * 서버에서만 접근 가능한 환경변수 검증
 * 다음 환경변수들은 클라이언트에 노출되면 안 됩니다:
 * - SUPABASE_SERVICE_ROLE_KEY
 * - 기타 서버 전용 키들
 */
export function getServerEnv() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다.')
  }

  return {
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
  }
}

/**
 * 안전하게 서버 환경변수를 가져옵니다.
 * 값이 없어도 오류를 던지지 않습니다.
 */
export function getServerEnvOptional() {
  return {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  }
}
