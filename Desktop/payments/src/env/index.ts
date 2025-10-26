/**
 * 환경변수 통합 관리
 * 서버와 클라이언트 환경변수를 구분하여 관리합니다.
 */

import { getServerEnv, getServerEnvOptional } from './server'
import { getClientEnv, getClientEnvOptional } from './client'

/**
 * 공통: Supabase 환경변수 검증 (서버/클라이언트 공통)
 * 기존 src/lib/env.ts의 기능을 개선
 */
export function validateSupabaseEnv() {
  // 클라이언트 환경변수로 로드
  const clientEnv = getClientEnvOptional()
  
  const url = clientEnv.NEXT_PUBLIC_SUPABASE_URL
  const key = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const error = 'Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
    console.error('❌', error)
    throw new Error(error)
  }

  return { url, key }
}

/**
 * 서버 전용: Supabase Service Role Key 가져오기
 */
export function getSupabaseServiceKey() {
  const serverEnv = getServerEnvOptional()
  return serverEnv.SUPABASE_SERVICE_ROLE_KEY
}

/**
 * 개발 환경에서 환경변수 상태를 출력합니다.
 */
export function logEnvStatus() {
  if (process.env.NODE_ENV !== 'development') return

  console.log('📋 환경변수 상태:')
  console.log('  - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 설정됨' : '❌ 누락')
  console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 누락')
  console.log('  - SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 설정됨' : '❌ 누락')
  console.log('  - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
}

// 모든 환경변수를 한 번에 가져오는 헬퍼
export const env = {
  // 클라이언트 환경변수
  client: getClientEnvOptional(),
  
  // 서버 환경변수
  server: getServerEnvOptional(),
  
  // 검증된 Supabase 설정
  supabase: validateSupabaseEnv,
  
  // 로그
  logStatus: logEnvStatus,
} as const
