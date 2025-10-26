/**
 * 환경변수 타입 정의
 * TypeScript에서 process.env에 접근할 때 타입 안전성을 제공합니다.
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Supabase 환경변수
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      SUPABASE_SERVICE_ROLE_KEY?: string
      
      // 애플리케이션 설정
      NEXT_PUBLIC_APP_URL?: string
      
      // 기타 환경변수
      NODE_ENV: 'development' | 'production' | 'test'
      
      // 커스텀 환경변수는 여기에 추가
      [key: string]: string | undefined
    }
  }
}

export {}
