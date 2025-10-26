import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000', 'localhost:3001', '127.0.0.1:3001'],
    },
  },
  // Server Action 호출 안정성을 위한 설정
  serverExternalPackages: ['@supabase/ssr'],
  
  // 환경변수 로드 설정
  env: {
    // 개발 시 .env.local을 명시적으로 로드
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
  
  // 환경변수 검증
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;
