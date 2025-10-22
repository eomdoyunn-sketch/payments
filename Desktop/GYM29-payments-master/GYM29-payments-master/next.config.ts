import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pgcmozwsjzsbroayfcny.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnY21vendzanpzYnJvYXlmY255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTE5ODQsImV4cCI6MjA3NTY4Nzk4NH0.ONAJxgp93e5gqIzQWhte2_E1IRXAgoLY_ieBnXuUhTU',
  },
};

export default nextConfig;
