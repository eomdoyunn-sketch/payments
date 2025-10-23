import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllCompanies, getCompanyRegistrationStats } from '@/app/actions/companies'
import { getAllPayments, getPaymentStats } from '@/app/actions/payments'
import { getGlobalSettings } from '@/app/actions/settings'
import { AdminPageClient } from '@/app/admin/AdminPageClient'

// 로딩 컴포넌트
function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">관리자 데이터를 불러오는 중...</p>
      </div>
    </div>
  )
}

// 서버 컴포넌트 - 데이터 페칭만 담당
export default async function AdminPage() {
  // 인증 체크만 수행 (권한 체크 제거)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // 데이터 병렬 로드
  const [companies, realTimeStats, payments, stats, settings] = await Promise.all([
    getAllCompanies().catch(() => []),
    getCompanyRegistrationStats().catch(() => []),
    getAllPayments().catch(() => []),
    getPaymentStats().catch(() => ({
      totalPayments: 0,
      totalAmount: 0,
      processedPayments: 0,
      pendingPayments: 0,
      completedPayments: 0,
    })),
    getGlobalSettings().catch(() => null),
  ])

  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminPageClient
        initialCompanies={companies}
        initialRealTimeStats={realTimeStats}
        initialPayments={payments}
        initialStats={stats}
        initialSettings={settings}
      />
    </Suspense>
  )
}
