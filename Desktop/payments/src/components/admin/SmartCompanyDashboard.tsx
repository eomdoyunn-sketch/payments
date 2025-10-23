"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw,
  Building2,
  Eye,
  ArrowUpDown,
  Lock,
  Unlock,
} from "lucide-react"

// 회원권 종류별 할당량 및 등록 현황
type MembershipQuota = {
  allDay: { assigned: number; registered: number; hasList: boolean }
  morning: { assigned: number; registered: number; hasList: boolean }
  evening: { assigned: number; registered: number; hasList: boolean }
}


type CompanyData = {
  id: string
  name: string
  code: string
  mode: 'FCFS' | 'WHL'
  membershipQuota: MembershipQuota
  status: 'active' | 'inactive'
  availableFrom: string
  availableUntil: string
}

type RegistrationData = {
  id: string
  company_id: string
  employee_id: string
  name: string
  email?: string
  phone?: string
  department?: string
  registered_at: string
  membership_type: '종일권' | '오전권' | '저녁권'
  membership_period: number
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
  toss_payment_key?: string
  toss_order_id?: string
  created_at: string
  updated_at: string
}


interface SmartCompanyDashboardProps {
  companies: CompanyData[]
  registrations: RegistrationData[]
  payments: PaymentData[]
  onRefresh?: () => void
  loading?: boolean
}

export function SmartCompanyDashboard({
  companies,
  registrations,
  payments,
  onRefresh,
  loading = false
}: SmartCompanyDashboardProps) {
  const [selectedCompany, setSelectedCompany] = React.useState<CompanyData | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'allDay' | 'morning' | 'evening' | 'unpaid' | 'paid'>('all')
  const [lockerFilter, setLockerFilter] = React.useState<'all' | 'withLocker' | 'withoutLocker'>('all')
  const [sortBy, setSortBy] = React.useState<'name' | 'paymentDate' | 'amount' | 'department'>('name')
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc')

  // 선택된 계열사의 등록자/명단과 결제내역 매칭
  const comparisonData = React.useMemo(() => {
    if (!selectedCompany) return []

    const companyRegistrations = registrations.filter(r => r.company_id === selectedCompany.id)
    
    return companyRegistrations.map(registration => {
      const memberPayments = payments.filter(payment => 
        payment.employee_id === registration.employee_id && 
        payment.name === registration.name
      )
      
      let status: 'paid' | 'unpaid' | 'partial' = 'unpaid'
      let totalAmount = 0
      let lastPaymentDate: string | undefined
      
      if (memberPayments.length > 0) {
        const completedPayments = memberPayments.filter(p => p.status === 'completed')
        totalAmount = memberPayments.reduce((sum, p) => sum + p.price, 0)
        lastPaymentDate = memberPayments.sort((a, b) => 
          new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime()
        )[0]?.payment_date

        if (completedPayments.length === memberPayments.length) {
          status = 'paid'
        } else if (completedPayments.length > 0) {
          status = 'partial'
        }
      }
      
      return {
        registration,
        payment: memberPayments[0],
        status,
        totalAmount,
        lastPaymentDate
      }
    })
  }, [selectedCompany, registrations, payments])

  // 필터링된 데이터
  const filteredData = React.useMemo(() => {
    let filtered = comparisonData

    // 기본 필터
    if (activeFilter === 'allDay') {
      filtered = filtered.filter(item => item.registration.membership_type === '종일권')
    } else if (activeFilter === 'morning') {
      filtered = filtered.filter(item => item.registration.membership_type === '오전권')
    } else if (activeFilter === 'evening') {
      filtered = filtered.filter(item => item.registration.membership_type === '저녁권')
    } else if (activeFilter === 'unpaid') {
      filtered = filtered.filter(item => item.status === 'unpaid')
    } else if (activeFilter === 'paid') {
      filtered = filtered.filter(item => item.status === 'paid')
    }

    // 사물함 필터
    if (lockerFilter === 'withLocker') {
      filtered = filtered.filter(item => item.payment?.has_locker === true)
    } else if (lockerFilter === 'withoutLocker') {
      filtered = filtered.filter(item => item.payment?.has_locker === false || !item.payment)
    }

    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.registration.name.localeCompare(b.registration.name)
          break
        case 'paymentDate':
          comparison = new Date(a.lastPaymentDate || 0).getTime() - new Date(b.lastPaymentDate || 0).getTime()
          break
        case 'amount':
          comparison = (a.totalAmount || 0) - (b.totalAmount || 0)
          break
        case 'department':
          comparison = (a.registration.department || '').localeCompare(b.registration.department || '')
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [comparisonData, activeFilter, lockerFilter, sortBy, sortOrder])

  // 회원권별 통계 계산
  const membershipStats = React.useMemo(() => {
    if (!selectedCompany) return null

    const stats = {
      allDay: { paid: 0, unpaid: 0, partial: 0 },
      morning: { paid: 0, unpaid: 0, partial: 0 },
      evening: { paid: 0, unpaid: 0, partial: 0 }
    }

    comparisonData.forEach(item => {
      const membershipType = item.registration.membership_type
      if (membershipType === '종일권') {
        stats.allDay[item.status]++
      } else if (membershipType === '오전권') {
        stats.morning[item.status]++
      } else if (membershipType === '저녁권') {
        stats.evening[item.status]++
      }
    })

    return stats
  }, [comparisonData, selectedCompany])

  // 전체 통계
  const totalStats = React.useMemo(() => {
    const total = comparisonData.length
    const paid = comparisonData.filter(item => item.status === 'paid').length
    const unpaid = comparisonData.filter(item => item.status === 'unpaid').length
    const partial = comparisonData.filter(item => item.status === 'partial').length
    const paidRate = total > 0 ? Math.round((paid / total) * 100) : 0

    return { total, paid, unpaid, partial, paidRate }
  }, [comparisonData])

  // 상태 배지
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            결제완료
          </Badge>
        )
      case 'unpaid':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            미결제
          </Badge>
        )
      case 'partial':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            부분결제
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // 엑셀 내보내기
  const exportToExcel = () => {
    if (!selectedCompany || filteredData.length === 0) return

    const exportData = filteredData.map((item, index) => ({
      번호: index + 1,
      사번: item.registration.employee_id,
      이름: item.registration.name,
      부서: item.registration.department || '',
      이메일: item.registration.email || '',
      연락처: item.registration.phone || '',
      등록일: new Date(item.registration.registered_at).toLocaleDateString('ko-KR'),
      회원권종류: item.registration.membership_type,
      결제상태: item.status === 'paid' ? '결제완료' : item.status === 'unpaid' ? '미결제' : '부분결제',
      마지막결제일: item.lastPaymentDate ? new Date(item.lastPaymentDate).toLocaleDateString('ko-KR') : '',
      총결제금액: item.totalAmount || 0,
      사물함: item.payment?.has_locker ? item.payment.locker_number || '미할당' : '없음'
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "계열사별대조")
    XLSX.writeFile(wb, `${selectedCompany.name}_대조결과_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleCompanyClick = (company: CompanyData) => {
    setSelectedCompany(company)
    setIsModalOpen(true)
    setActiveFilter('all')
    setLockerFilter('all')
    setSortBy('name')
    setSortOrder('asc')
  }

  return (
    <div className="space-y-6">
      {/* 상단 컨트롤 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">계열사 결제 현황 대시보드</h2>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
          )}
        </div>
      </div>

      {/* 계열사 카드 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => {
          const companyRegistrations = registrations.filter(r => r.company_id === company.id)
          const companyPayments = payments.filter(p => p.company === company.name)
          
          // 통계 계산
          const totalRegistered = companyRegistrations.length
          const totalPaid = companyPayments.filter(p => p.status === 'completed').length
          const paidRate = totalRegistered > 0 ? Math.round((totalPaid / totalRegistered) * 100) : 0

          return (
            <Card 
              key={company.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => handleCompanyClick(company)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{paidRate}%</div>
                    <div className="text-xs text-muted-foreground">{totalPaid}/{totalRegistered}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={company.mode === 'WHL' ? 'default' : 'secondary'}>
                    {company.mode === 'FCFS' ? '선착순' : '추첨제'}
                  </Badge>
                  <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                    {company.status === 'active' ? '활성' : '비활성'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 회원권별 현황 */}
                <div className="grid grid-cols-3 gap-3">
                  {/* 종일권 */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600 mb-1">종일권</div>
                    <div className="text-xs text-muted-foreground">
                      {company.membershipQuota.allDay.assigned}/{company.membershipQuota.allDay.registered}
                    </div>
                    <Progress 
                      value={company.membershipQuota.allDay.assigned > 0 ? (company.membershipQuota.allDay.registered / company.membershipQuota.allDay.assigned) * 100 : 0} 
                      className="h-1 mt-1"
                    />
                  </div>
                  
                  {/* 오전권 */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-green-600 mb-1">오전권</div>
                    <div className="text-xs text-muted-foreground">
                      {company.membershipQuota.morning.assigned}/{company.membershipQuota.morning.registered}
                    </div>
                    <Progress 
                      value={company.membershipQuota.morning.assigned > 0 ? (company.membershipQuota.morning.registered / company.membershipQuota.morning.assigned) * 100 : 0} 
                      className="h-1 mt-1"
                    />
                  </div>
                  
                  {/* 저녁권 */}
                  <div className="text-center">
                    <div className="text-sm font-medium text-purple-600 mb-1">저녁권</div>
                    <div className="text-xs text-muted-foreground">
                      {company.membershipQuota.evening.assigned}/{company.membershipQuota.evening.registered}
                    </div>
                    <Progress 
                      value={company.membershipQuota.evening.assigned > 0 ? (company.membershipQuota.evening.registered / company.membershipQuota.evening.assigned) * 100 : 0} 
                      className="h-1 mt-1"
                    />
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-between items-center pt-2">
                  <Button variant="ghost" size="sm" className="h-8">
                    <Eye className="h-4 w-4 mr-1" />
                    상세보기
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-1" />
                    엑셀
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 상세 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedCompany?.name} 상세 결제내역
            </DialogTitle>
            <DialogDescription>
              등록자별 결제 현황을 확인하고 관리할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 필터 컨트롤 */}
            <div className="flex flex-wrap gap-2">
              <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as 'all' | 'allDay' | 'morning' | 'evening' | 'unpaid' | 'paid')}>
                <TabsList>
                  <TabsTrigger value="all">전체 ({totalStats.total})</TabsTrigger>
                  <TabsTrigger value="allDay">종일권 ({membershipStats?.allDay.paid + membershipStats?.allDay.unpaid + membershipStats?.allDay.partial || 0})</TabsTrigger>
                  <TabsTrigger value="morning">오전권 ({membershipStats?.morning.paid + membershipStats?.morning.unpaid + membershipStats?.morning.partial || 0})</TabsTrigger>
                  <TabsTrigger value="evening">저녁권 ({membershipStats?.evening.paid + membershipStats?.evening.unpaid + membershipStats?.evening.partial || 0})</TabsTrigger>
                  <TabsTrigger value="unpaid">미결제 ({totalStats.unpaid + totalStats.partial})</TabsTrigger>
                  <TabsTrigger value="paid">결제완료 ({totalStats.paid})</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2 ml-auto">
                <Select value={lockerFilter} onValueChange={(value) => setLockerFilter(value as 'all' | 'withLocker' | 'withoutLocker')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="withLocker">사물함O</SelectItem>
                    <SelectItem value="withoutLocker">사물함X</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'name' | 'paymentDate' | 'amount' | 'department')}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">이름순</SelectItem>
                    <SelectItem value="paymentDate">결제일순</SelectItem>
                    <SelectItem value="amount">금액순</SelectItem>
                    <SelectItem value="department">부서순</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 통계 요약 */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalStats.total}</div>
                <div className="text-sm text-muted-foreground">전체 등록자</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{totalStats.paid}</div>
                <div className="text-sm text-muted-foreground">결제완료</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{totalStats.unpaid + totalStats.partial}</div>
                <div className="text-sm text-muted-foreground">미결제</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalStats.paidRate}%</div>
                <div className="text-sm text-muted-foreground">결제율</div>
              </div>
            </div>

            {/* 상세 테이블 */}
            <div className="max-h-96 overflow-auto">
              <div className="w-full">
                <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">이름</TableHead>
                    <TableHead className="min-w-[80px]">사번</TableHead>
                    <TableHead className="min-w-[100px]">부서</TableHead>
                    <TableHead className="min-w-[80px]">회원권</TableHead>
                    <TableHead className="min-w-[100px]">결제상태</TableHead>
                    <TableHead className="min-w-[80px]">사물함</TableHead>
                    <TableHead className="min-w-[100px]">결제일</TableHead>
                    <TableHead className="min-w-[120px]">금액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium min-w-[100px]">{item.registration.name}</TableCell>
                      <TableCell className="min-w-[80px]">{item.registration.employee_id}</TableCell>
                      <TableCell className="min-w-[100px]">{item.registration.department || '-'}</TableCell>
                      <TableCell className="min-w-[80px]">
                        <Badge variant="outline">{item.registration.membership_type}</Badge>
                      </TableCell>
                      <TableCell className="min-w-[100px]">{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="min-w-[80px]">
                        {item.payment?.has_locker ? (
                          <div className="flex items-center gap-1">
                            <Lock className="h-3 w-3 text-green-600" />
                            <span className="text-sm">{item.payment.locker_number}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Unlock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">없음</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        {item.lastPaymentDate ? 
                          new Date(item.lastPaymentDate).toLocaleDateString('ko-KR') : 
                          '-'
                        }
                      </TableCell>
                      <TableCell className="font-medium min-w-[120px]">
                        {item.totalAmount ? `₩${item.totalAmount.toLocaleString()}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={exportToExcel}>
              <Download className="h-4 w-4 mr-2" />
              엑셀 다운로드
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
