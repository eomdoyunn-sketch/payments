/**
 * 환경변수 검증 및 관리 유틸리티 (레거시 호환)
 * 새로운 코드에서는 @/env를 사용하는 것을 권장합니다.
 */

import { validateSupabaseEnv as validateEnv, getSupabaseServiceKey as getServiceKey } from '@/env'

// 레거시 호환성을 위한 재익스포트
export const validateSupabaseEnv = validateEnv
export const getSupabaseServiceKey = getServiceKey

/**
 * @deprecated 이 함수는 더 이상 사용되지 않습니다.
 * 대신 @/env의 validateSupabaseEnv를 사용하세요.
 */
export function validateSupabaseEnvOld() {
  console.warn('⚠️ validateSupabaseEnvOld는 deprecated되었습니다. @/env의 validateSupabaseEnv를 사용하세요.')
  return validateEnv()
}
