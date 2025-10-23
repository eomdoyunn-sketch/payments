/**
 * 환경변수 검증 및 관리 유틸리티
 */

export function validateSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('환경변수 확인:', { 
    hasUrl: !!url, 
    hasKey: !!key,
    urlLength: url?.length,
    keyLength: key?.length
  })
  
  if (!url || !key) {
    const error = 'Supabase 환경변수가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'
    console.error(error)
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
  
  return { url, key }
}

export function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY
}
