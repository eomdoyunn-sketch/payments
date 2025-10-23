import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '127.0.0.1:3000'],
    },
  },
  // Server Action 호출 안정성을 위한 설정
  serverExternalPackages: ['@supabase/ssr'],
};

export default nextConfig;
