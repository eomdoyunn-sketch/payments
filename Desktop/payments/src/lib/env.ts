/**
 * 환경변수 검증 및 관리 유틸리티
 */

// 환경변수 검증 캐싱
let envValidationCache: { url: string; key: string } | null = null

export function validateSupabaseEnv() {
  // 이미 검증된 환경변수가 있으면 재사용
  if (envValidationCache) {
    return envValidationCache
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // 개발 환경에서만 상세 로그 출력
  if (process.env.NODE_ENV === 'development') {
    console.log('환경변수 확인:', { 
      hasUrl: !!url, 
      hasKey: !!key,
      urlLength: url?.length,
      keyLength: key?.length
    })
  }
  
  if (!url || !key) {
    const error = 'Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
    console.error(error)
    // 개발 환경에서는 기본값 사용
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ 개발 환경에서 Supabase 환경변수 누락, 기본값 사용')
      return { url: 'https://placeholder.supabase.co', key: 'placeholder-key' }
    }
    throw new Error(error)
  }
  
  // URL 형식 검증
  try {
    const urlObj = new URL(url)
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error('URL 프로토콜이 올바르지 않습니다.')
    }
  } catch (error) {
    const errorMsg = 'NEXT_PUBLIC_SUPABASE_URL이 올바른 URL 형식이 아닙니다.'
    console.error(errorMsg, { url, originalError: error })
    throw new Error(errorMsg)
  }
  
  // 키 형식 검증 (JWT 토큰인지 확인)
  if (!key.startsWith('eyJ')) {
    const error = 'NEXT_PUBLIC_SUPABASE_ANON_KEY가 올바른 형식이 아닙니다.'
    console.error(error)
    throw new Error(error)
  }
  
  // 검증 성공 시 캐시에 저장
  envValidationCache = { url, key }
  return { url, key }
}

export function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY
}
