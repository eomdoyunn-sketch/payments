"use client"

// 대시보드 클라이언트 컴포넌트
import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useOptimizedRealtime, useRealtimeSubscription } from "@/hooks/useOptimizedRealtime"
import { useOptimizedCompanies } from "@/hooks/useOptimizedState"
import { useCompanyStatusDebounce } from "@/hooks/useDebouncedSave"
import { getGlobalSettings } from "@/app/actions/settings"
import {
  RefreshCw,
  CreditCard,
  DollarSign,
  Building2,
  Users,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react"

type CompanyData = {
  id?: number | string
  code: string
  name: string
  status: 'active' | 'inactive'
  quota?: { fullDay: number; morning: number; evening: number }
  mode?: 'FCFS' | 'WHL'
  registered?: number
  remaining?: number
  [key: string]: unknown
}

type PaymentData = {
  id: string
  payment_date: string
  company: string
  employee_id: string
  name: string
  gender: '남' | '여'
  membership_type: string
  membership_period: number
  has_locker: boolean
  locker_period: number
  locker_number?: string
  price: number
  status: string
  processed: boolean
  memo?: string
}

interface DashboardClientProps {
  initialCompanies: CompanyData[]
  initialRealTimeStats: Array<{ code: string; name: string; registered: number }>
  initialPayments: PaymentData[]
  initialStats: {
    totalPayments: number
    totalAmount: number
    processedPayments: number
    pendingPayments: number
    completedPayments: number
  }
  initialSettings: any
}

export function DashboardClient({
  initialCompanies,
  initialRealTimeStats,
  initialPayments,
  initialStats,
  initialSettings,
}: DashboardClientProps) {
  const router = useRouter()
  const [isClient, setIsClient] = React.useState(false)

  // 최적화된 상태 관리
  const {
    companies,
    updateCompanyInfo,
    setCompanies
  } = useOptimizedCompanies(initialCompanies)

  // 디바운스된 저장
  const { addChange: addCompanyChange, pendingCount, isSaving } = useCompanyStatusDebounce()

  // 실시간 통계 상태
  const [realTimeStats, setRealTimeStats] = React.useState(initialRealTimeStats)
  
  // Hydration 문제 해결
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // 최적화된 실시간 구독
  const { isConnected } = useRealtimeSubscription(
    // 회사 정보 업데이트 핸들러
    React.useCallback((updatedCompany) => {
      updateCompanyInfo(updatedCompany.id, updatedCompany)
      toast.info('계열사 정보가 업데이트되었습니다')
    }, [updateCompanyInfo]),
    
    // 결제 정보 업데이트 핸들러
    React.useCallback((updatedPayment) => {
      console.log('결제 정보 업데이트:', updatedPayment)
      toast.info('새로운 결제가 등록되었습니다')
    }, []),
    
    // 설정 업데이트 핸들러
    React.useCallback(async (updatedSettings) => {
      try {
        const globalSettings = await getGlobalSettings()
        toast.info('전역 설정이 업데이트되었습니다')
      } catch (error) {
        console.error('설정 업데이트 실패:', error)
      }
    }, [])
  )

  // 새로고침 핸들러
  const handleRefresh = () => {
    toast.info("데이터를 새로고침합니다...")
    router.refresh()
  }

  // 통계 계산
  const dashboardStats = React.useMemo(() => {
    const totalRegistered = realTimeStats.reduce((sum, stat) => sum + stat.registered, 0)
    const totalQuota = initialCompanies.reduce((sum, c) => {
      const quota = c.quota || { fullDay: 0, morning: 0, evening: 0 }
      return sum + quota.fullDay + quota.morning + quota.evening
    }, 0)

    // 오늘의 결제 건수 계산
    const today = new Date().toISOString().split('T')[0]
    const todayPayments = initialPayments.filter(payment => 
      payment.payment_date.startsWith(today)
    )

    // 이번 주 결제 건수 계산
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const weekPayments = initialPayments.filter(payment => 
      new Date(payment.payment_date) >= weekAgo
    )

    return {
      ...initialStats,
      totalCompanies: initialCompanies.length,
      activeCompanies: initialCompanies.filter(c => c.status === 'active').length,
      totalQuota,
      totalRegistered,
      remainingQuota: totalQuota - totalRegistered,
      todayPayments: todayPayments.length,
      weekPayments: weekPayments.length,
      todayAmount: todayPayments.reduce((sum, p) => sum + p.price, 0),
      weekAmount: weekPayments.reduce((sum, p) => sum + p.price, 0),
    }
  }, [realTimeStats, initialCompanies, initialStats, initialPayments])

  // 실시간 데이터와 병합된 계열사 목록
  const companiesWithRealTimeData = React.useMemo(() => {
    return initialCompanies.map(company => {
      const stat = realTimeStats.find(s => s.code === company.code)
      if (stat) {
        const allocatedTotal = company.quota 
          ? company.quota.fullDay + company.quota.morning + company.quota.evening 
          : 0
        return {
          ...company,
          registered: stat.registered,
          remaining: allocatedTotal - stat.registered
        }
      }
      return company
    })
  }, [initialCompanies, realTimeStats])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <PageHeader
        title="📊 실시간 대시보드"
        description="GYM29 회원권 및 개인사물함 등록/결제 현황을 실시간으로 확인하세요"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              새로고침
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              {isConnected ? '실시간 연결됨' : '연결 끊김'}
            </div>
          </div>
        }
      />

      {/* 주요 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 결제 건수</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              처리완료: {dashboardStats.processedPayments} / 미처리: {dashboardStats.pendingPayments}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 결제 금액</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{dashboardStats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">전체 누적 금액</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 계열사</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.activeCompanies}/{dashboardStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">현재 운영 중인 계열사</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 현황</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalRegistered}/{dashboardStats.totalQuota}</div>
            <p className="text-xs text-muted-foreground">
              잔여: {dashboardStats.remainingQuota}명
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 일일/주간 통계 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">오늘의 결제</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.todayPayments}건</div>
            <p className="text-xs text-muted-foreground">
              금액: ₩{dashboardStats.todayAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 주 결제</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.weekPayments}건</div>
            <p className="text-xs text-muted-foreground">
              금액: ₩{dashboardStats.weekAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 계열사별 등록 현황 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🏢 계열사별 등록 현황</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companiesWithRealTimeData.map((company) => {
            const quota = company.quota || { fullDay: 0, morning: 0, evening: 0 }
            const totalQuota = quota.fullDay + quota.morning + quota.evening
            const registered = company.registered || 0
            const remaining = company.remaining || 0
            const percentage = totalQuota > 0 ? Math.round((registered / totalQuota) * 100) : 0

            return (
              <Card key={company.code}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{company.name}</CardTitle>
                    <div className={`w-2 h-2 rounded-full ${company.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{company.code}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>등록된 인원</span>
                      <span className="font-medium">{registered}/{totalQuota}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage}%</span>
                      <span>잔여: {remaining}명</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      모드: {company.mode === 'WHL' ? '추첨제' : '선착순'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 최근 결제 내역 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">💳 최근 결제 내역</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {initialPayments.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.name}</p>
                      <p className="text-sm text-muted-foreground">{payment.company} • {payment.employee_id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₩{payment.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {initialPayments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  아직 결제 내역이 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
