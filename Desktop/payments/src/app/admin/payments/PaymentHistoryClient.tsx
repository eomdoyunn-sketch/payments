"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PaymentHistoryTable } from "@/components/admin/PaymentHistoryTable"
import { PaymentFilters } from "@/components/admin/PaymentFilters"
import { PaymentStats } from "@/components/admin/PaymentStats"
import { ExcelUploadModal } from "@/components/admin/ExcelUploadModal"
import { PaymentStatusTable } from "@/components/admin/PaymentStatusTable"
import { CompanyComparisonTable } from "@/components/admin/CompanyComparisonTable"
import { SmartCompanyDashboard } from "@/components/admin/SmartCompanyDashboard"
import { toast } from "sonner"
import {
  updatePaymentProcessed,
  updateLockerNumber,
  updatePaymentMemo,
} from "@/app/actions/payments"
import {
  RefreshCw,
  Download,
  Filter,
  Search,
  Upload,
  FileSpreadsheet,
} from "lucide-react"

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
  toss_payment_key?: string
  toss_order_id?: string
  created_at: string
  updated_at: string
}

type PaymentStats = {
  totalPayments: number
  totalAmount: number
  processedPayments: number
  pendingPayments: number
  completedPayments: number
}

type ExcelMember = {
  사번: string
  이름: string
  이메일?: string
  연락처?: string
  부서?: string
}

type PaymentStatusData = {
  member: ExcelMember
  payment?: PaymentData
  status: 'paid' | 'unpaid' | 'partial'
  lastPaymentDate?: string
  totalAmount?: number
}

interface PaymentHistoryClientProps {
  initialPayments: PaymentData[]
  initialStats: PaymentStats
}

export function PaymentHistoryClient({
  initialPayments,
  initialStats
}: PaymentHistoryClientProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [payments, setPayments] = React.useState<PaymentData[]>(initialPayments)
  const [stats, setStats] = React.useState<PaymentStats>(initialStats)
  const [loading, setLoading] = React.useState(false)
  const [filters, setFilters] = React.useState({
    company: 'all',
    status: 'all',
    processed: 'all',
    search: ''
  })
  const [showExcelUpload, setShowExcelUpload] = React.useState(false)
  const [uploadedMembers, setUploadedMembers] = React.useState<ExcelMember[]>([])
  const [paymentStatusData, setPaymentStatusData] = React.useState<PaymentStatusData[]>([])
  const [activeTab, setActiveTab] = React.useState<'payments' | 'status' | 'company-comparison' | 'smart-dashboard'>('payments')

  // 결제 내역 새로고침
  const refreshPayments = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 결제 내역 다시 로드
      const response = await fetch('/api/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
        setStats(data.stats || initialStats)
      }
    } catch (error) {
      console.error('결제 내역 새로고침 실패:', error)
      toast.error('결제 내역을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // 처리 상태 토글
  const handleToggleProcessed = async (paymentId: string, processed: boolean) => {
    try {
      await updatePaymentProcessed(paymentId, processed)
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, processed }
          : payment
      ))
      
      toast.success(processed ? '처리 완료로 변경되었습니다.' : '미처리로 변경되었습니다.')
    } catch (error) {
      console.error('처리 상태 변경 실패:', error)
      toast.error('처리 상태 변경에 실패했습니다.')
    }
  }

  // 사물함 번호 업데이트
  const handleUpdateLockerNumber = async (paymentId: string, lockerNumber: string) => {
    try {
      await updateLockerNumber(paymentId, lockerNumber)
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, locker_number: lockerNumber }
          : payment
      ))
      
      toast.success('사물함 번호가 업데이트되었습니다.')
    } catch (error) {
      console.error('사물함 번호 업데이트 실패:', error)
      toast.error('사물함 번호 업데이트에 실패했습니다.')
    }
  }

  // 메모 업데이트
  const handleUpdateMemo = async (paymentId: string, memo: string) => {
    try {
      await updatePaymentMemo(paymentId, memo)
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, memo }
          : payment
      ))
      
      toast.success('메모가 업데이트되었습니다.')
    } catch (error) {
      console.error('메모 업데이트 실패:', error)
      toast.error('메모 업데이트에 실패했습니다.')
    }
  }

  // 명단 업로드 핸들러
  const handleExcelUpload = (members: ExcelMember[]) => {
    setUploadedMembers(members)
    setShowExcelUpload(false)
    
    // 결제 상태 데이터 생성
    const statusData: PaymentStatusData[] = members.map(member => {
      // 해당 사번과 이름으로 결제 내역 찾기
      const memberPayments = payments.filter(payment => 
        payment.employee_id === member.사번 && payment.name === member.이름
      )
      
      if (memberPayments.length === 0) {
        return {
          member,
          status: 'unpaid' as const
        }
      }
      
      // 결제 상태 확인
      const completedPayments = memberPayments.filter(p => p.status === 'completed')
      const totalAmount = memberPayments.reduce((sum, p) => sum + p.price, 0)
      const lastPayment = memberPayments.sort((a, b) => 
        new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
      )[0]
      
      let status: 'paid' | 'unpaid' | 'partial' = 'unpaid'
      if (completedPayments.length === memberPayments.length) {
        status = 'paid'
      } else if (completedPayments.length > 0) {
        status = 'partial'
      }
      
      return {
        member,
        payment: lastPayment,
        status,
        lastPaymentDate: lastPayment?.payment_date,
        totalAmount
      }
    })
    
    setPaymentStatusData(statusData)
    setActiveTab('status')
    toast.success(`${members.length}명의 명단이 업로드되었습니다.`)
  }

  // 필터링된 결제 내역
  const filteredPayments = React.useMemo(() => {
    return payments.filter(payment => {
      if (filters.company !== 'all' && payment.company !== filters.company) return false
      if (filters.status !== 'all' && payment.status !== filters.status) return false
      if (filters.processed !== 'all' && payment.processed.toString() !== filters.processed) return false
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        return (
          payment.name.toLowerCase().includes(searchTerm) ||
          payment.employee_id.toLowerCase().includes(searchTerm) ||
          payment.company.toLowerCase().includes(searchTerm)
        )
      }
      return true
    })
  }, [payments, filters])

  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader
        title="결제내역 관리"
        description="GYM29 결제 내역 조회 및 관리"
      />

      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-4 border-b">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'payments'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('payments')}
        >
          결제 내역
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'status'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('status')}
        >
          결제 상태 확인
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'company-comparison'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('company-comparison')}
        >
          계열사별 대조
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'smart-dashboard'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('smart-dashboard')}
        >
          스마트 대시보드
        </button>
        {activeTab === 'status' && (
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExcelUpload(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              명단 업로드
            </Button>
          </div>
        )}
      </div>

      {/* 탭별 콘텐츠 */}
      {activeTab === 'payments' && (
        <>
          {/* 통계 카드 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 결제 건수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              처리완료: {stats.processedPayments} / 미처리: {stats.pendingPayments}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 결제 금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">전체 누적 금액</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 결제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedPayments}</div>
            <p className="text-xs text-muted-foreground">성공적으로 처리된 결제</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">미처리 결제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">처리 대기 중인 결제</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            필터 및 검색
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentFilters
            filters={filters}
            onFiltersChange={setFilters}
            onRefresh={refreshPayments}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* 결제 내역 테이블 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>결제 내역</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshPayments}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PaymentHistoryTable
            data={filteredPayments}
            onToggleProcessed={handleToggleProcessed}
            onUpdateLockerNumber={handleUpdateLockerNumber}
            onUpdateMemo={handleUpdateMemo}
          />
        </CardContent>
      </Card>
        </>
      )}

      {/* 결제 상태 확인 탭 */}
      {activeTab === 'status' && (
        <div className="space-y-6">
          {paymentStatusData.length > 0 ? (
            <PaymentStatusTable
              data={paymentStatusData}
              onRefresh={refreshPayments}
              loading={loading}
            />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">명단을 업로드해주세요</h3>
                <p className="text-muted-foreground mb-4">
                  엑셀 파일로 직원 명단을 업로드하여 결제 상태를 확인할 수 있습니다.
                </p>
                <Button onClick={() => setShowExcelUpload(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  명단 업로드
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 계열사별 대조 탭 */}
      {activeTab === 'company-comparison' && (
        <div className="space-y-6">
          <CompanyComparisonTable
            companies={[
              {
                id: "B01",
                name: "한화건설",
                code: "H01",
                mode: "FCFS",
                membershipQuota: {
                  allDay: { assigned: 20, registered: 15, hasList: false },
                  morning: { assigned: 21, registered: 12, hasList: false },
                  evening: { assigned: 41, registered: 11, hasList: false }
                },
                status: "active",
                availableFrom: "2025-10-07",
                availableUntil: "2025-10-11"
              },
              {
                id: "B02", 
                name: "LG화학",
                code: "H02",
                mode: "WHL",
                membershipQuota: {
                  allDay: { assigned: 45, registered: 0, hasList: true },
                  morning: { assigned: 8, registered: 0, hasList: true },
                  evening: { assigned: 18, registered: 0, hasList: true }
                },
                status: "active",
                availableFrom: "2025-10-07",
                availableUntil: "2025-10-11"
              },
              {
                id: "B03",
                name: "삼성전자", 
                code: "H03",
                mode: "FCFS",
                membershipQuota: {
                  allDay: { assigned: 20, registered: 20, hasList: false },
                  morning: { assigned: 0, registered: 0, hasList: false },
                  evening: { assigned: 0, registered: 0, hasList: false }
                },
                status: "active",
                availableFrom: "2025-10-07",
                availableUntil: "2025-10-11"
              }
            ]}
            registrations={[
              {
                id: "R001",
                company_id: "B01",
                employee_id: "EMP001",
                name: "김도윤",
                email: "doyun@hanwha.com",
                phone: "010-1234-5678",
                department: "개발팀",
                registered_at: "2025-01-10T09:00:00Z",
                membership_type: "종일권",
                membership_period: 3
              },
              {
                id: "R002",
                company_id: "B01", 
                employee_id: "EMP002",
                name: "이영희",
                email: "younghee@hanwha.com",
                phone: "010-2345-6789",
                department: "마케팅팀",
                registered_at: "2025-01-10T10:30:00Z",
                membership_type: "오전권",
                membership_period: 3
              },
              {
                id: "R003",
                company_id: "B01",
                employee_id: "EMP003", 
                name: "박철수",
                email: "chulsoo@hanwha.com",
                phone: "010-3456-7890",
                department: "영업팀",
                registered_at: "2025-01-11T14:15:00Z",
                membership_type: "저녁권",
                membership_period: 1
              },
              {
                id: "R004",
                company_id: "B01",
                employee_id: "EMP004",
                name: "정하늘", 
                email: "haneul@hanwha.com",
                phone: "010-4567-8901",
                department: "인사팀",
                registered_at: "2025-01-11T16:45:00Z",
                membership_type: "종일권",
                membership_period: 3
              }
            ]}
            payments={payments}
            onRefresh={refreshPayments}
            loading={loading}
          />
        </div>
      )}

      {/* 스마트 대시보드 탭 */}
      {activeTab === 'smart-dashboard' && (
        <div className="space-y-6">
          <SmartCompanyDashboard
            companies={[
              {
                id: "B01",
                name: "한화건설",
                code: "H01",
                mode: "FCFS",
                membershipQuota: {
                  allDay: { assigned: 20, registered: 15, hasList: false },
                  morning: { assigned: 21, registered: 12, hasList: false },
                  evening: { assigned: 41, registered: 11, hasList: false }
                },
                status: "active",
                availableFrom: "2025-10-07",
                availableUntil: "2025-10-11"
              },
              {
                id: "B02", 
                name: "LG화학",
                code: "H02",
                mode: "WHL",
                membershipQuota: {
                  allDay: { assigned: 45, registered: 0, hasList: true },
                  morning: { assigned: 8, registered: 0, hasList: true },
                  evening: { assigned: 18, registered: 0, hasList: true }
                },
                status: "active",
                availableFrom: "2025-10-07",
                availableUntil: "2025-10-11"
              },
              {
                id: "B03",
                name: "삼성전자", 
                code: "H03",
                mode: "FCFS",
                membershipQuota: {
                  allDay: { assigned: 20, registered: 20, hasList: false },
                  morning: { assigned: 0, registered: 0, hasList: false },
                  evening: { assigned: 0, registered: 0, hasList: false }
                },
                status: "active",
                availableFrom: "2025-10-07",
                availableUntil: "2025-10-11"
              }
            ]}
            registrations={[
              {
                id: "R001",
                company_id: "B01",
                employee_id: "EMP001",
                name: "김도윤",
                email: "doyun@hanwha.com",
                phone: "010-1234-5678",
                department: "개발팀",
                registered_at: "2025-01-10T09:00:00Z",
                membership_type: "종일권",
                membership_period: 3
              },
              {
                id: "R002",
                company_id: "B01", 
                employee_id: "EMP002",
                name: "이영희",
                email: "younghee@hanwha.com",
                phone: "010-2345-6789",
                department: "마케팅팀",
                registered_at: "2025-01-10T10:30:00Z",
                membership_type: "오전권",
                membership_period: 3
              },
              {
                id: "R003",
                company_id: "B01",
                employee_id: "EMP003", 
                name: "박철수",
                email: "chulsoo@hanwha.com",
                phone: "010-3456-7890",
                department: "영업팀",
                registered_at: "2025-01-11T14:15:00Z",
                membership_type: "저녁권",
                membership_period: 1
              },
              {
                id: "R004",
                company_id: "B01",
                employee_id: "EMP004",
                name: "정하늘", 
                email: "haneul@hanwha.com",
                phone: "010-4567-8901",
                department: "인사팀",
                registered_at: "2025-01-11T16:45:00Z",
                membership_type: "종일권",
                membership_period: 3
              }
            ]}
            payments={payments}
            onRefresh={refreshPayments}
            loading={loading}
          />
        </div>
      )}

      {/* 엑셀 업로드 모달 */}
      <ExcelUploadModal
        open={showExcelUpload}
        onOpenChange={setShowExcelUpload}
        onUpload={handleExcelUpload}
      />
    </div>
  )
}

