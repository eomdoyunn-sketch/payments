import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AgreementManagementClient } from './AgreementManagementClient'

// 로딩 컴포넌트
function AgreementLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">동의서 정보를 불러오는 중...</p>
      </div>
    </div>
  )
}

// 서버 컴포넌트 - 데이터 페칭만 담당
export default async function AgreementManagementPage() {
  // 인증 체크
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <Suspense fallback={<AgreementLoading />}>
      <AgreementManagementClient />
    </Suspense>
  )
}

