import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllPayments, getPaymentStats } from '@/app/actions/payments'
import { PaymentHistoryClient } from './PaymentHistoryClient'

// 로딩 컴포넌트
function PaymentLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">결제 내역을 불러오는 중...</p>
      </div>
    </div>
  )
}

// 서버 컴포넌트 - 데이터 페칭만 담당
export default async function PaymentHistoryPage() {
  // 인증 체크
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // 데이터 병렬 로드
  const [payments, stats] = await Promise.all([
    getAllPayments().catch(() => []),
    getPaymentStats().catch(() => ({
      totalPayments: 0,
      totalAmount: 0,
      processedPayments: 0,
      pendingPayments: 0,
      completedPayments: 0,
    }))
  ])

  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentHistoryClient
        initialPayments={payments}
        initialStats={stats}
      />
    </Suspense>
  )
}

