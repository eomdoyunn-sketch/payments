"use client"

import * as React from "react"
import * as XLSX from "xlsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download,
  RefreshCw,
  Building2,
  Users,
  CreditCard,
  Upload,
  Edit,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

// 회원권 종류별 할당량 및 등록 현황
type MembershipQuota = {
  allDay: { assigned: number; registered: number; hasList: boolean }
  morning: { assigned: number; registered: number; hasList: boolean }
  evening: { assigned: number; registered: number; hasList: boolean }
}

// 회원권 종류별 결제 현황
type MembershipPaymentStatus = {
  allDay: { paid: number; unpaid: number; partial: number }
  morning: { paid: number; unpaid: number; partial: number }
  evening: { paid: number; unpaid: number; partial: number }
}

type CompanyData = {
  id: string
  name: string
  code: string
  mode: 'FCFS' | 'WHL' // 선착순 | 추첨제
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

type CompanyComparisonTableProps = {
  companies: CompanyData[]
  registrations: RegistrationData[]
  payments: PaymentData[]
  onRefresh?: () => void
  loading?: boolean
}

export function CompanyComparisonTable({
  companies,
  registrations,
  payments,
  onRefresh,
  loading = false
}: CompanyComparisonTableProps) {
  const [selectedCompany, setSelectedCompany] = React.useState<string>('')

  // 선택된 계열사 정보
  const selectedCompanyInfo = companies.find(c => c.id === selectedCompany)

  // 선택된 계열사의 등록자/명단과 결제내역 매칭
  const comparisonData = React.useMemo(() => {
    if (!selectedCompanyInfo) return []

    const companyRegistrations = registrations.filter(r => r.company_id === selectedCompany)
    
    return companyRegistrations.map(registration => {
      // 해당 등록자의 결제내역 찾기
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
        status,
        totalAmount,
        lastPaymentDate
      }
    })
  }, [selectedCompanyInfo, registrations, payments])

  // 회원권 종류별 통계 계산
  const membershipStats = React.useMemo(() => {
    if (!selectedCompanyInfo) return null

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
  }, [comparisonData, selectedCompanyInfo])

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
    if (!selectedCompanyInfo || comparisonData.length === 0) return

    const exportData = comparisonData.map((item, index) => ({
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
      사물함: item.registration.membership_type === '종일권' ? '있음' : '없음'
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "계열사별대조")
    XLSX.writeFile(wb, `${selectedCompanyInfo.name}_대조결과_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-4">
      {/* 계열사 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            계열사 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="계열사를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name} ({company.mode === 'FCFS' ? '선착순' : '추첨제'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        </CardContent>
      </Card>

      {/* 계열사 현황 테이블 (통합관리자 양식) */}
      {selectedCompanyInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                계열사 등록 현황
              </span>
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                엑셀 내보내기
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">계열사명</TableHead>
                    <TableHead className="w-[80px]">코드</TableHead>
                    <TableHead className="w-[80px]">방식</TableHead>
                    <TableHead colSpan={4} className="text-center">종일권</TableHead>
                    <TableHead colSpan={4} className="text-center">오전권</TableHead>
                    <TableHead colSpan={4} className="text-center">저녁권</TableHead>
                    <TableHead className="w-[80px]">활성</TableHead>
                    <TableHead className="w-[100px]">액션</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                    <TableHead className="text-center">배정</TableHead>
                    <TableHead className="text-center">등록</TableHead>
                    <TableHead className="text-center">명단</TableHead>
                    <TableHead className="text-center">결제현황</TableHead>
                    <TableHead className="text-center">배정</TableHead>
                    <TableHead className="text-center">등록</TableHead>
                    <TableHead className="text-center">명단</TableHead>
                    <TableHead className="text-center">결제현황</TableHead>
                    <TableHead className="text-center">배정</TableHead>
                    <TableHead className="text-center">등록</TableHead>
                    <TableHead className="text-center">명단</TableHead>
                    <TableHead className="text-center">결제현황</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{selectedCompanyInfo.name}</TableCell>
                    <TableCell>{selectedCompanyInfo.code}</TableCell>
                    <TableCell>
                      <Badge variant={selectedCompanyInfo.mode === 'WHL' ? 'default' : 'secondary'}>
                        {selectedCompanyInfo.mode === 'FCFS' ? '선착' : '추첨'}
                      </Badge>
                    </TableCell>
                    
                    {/* 종일권 */}
                    <TableCell className="text-center font-medium">
                      {selectedCompanyInfo.membershipQuota.allDay.assigned}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedCompanyInfo.membershipQuota.allDay.registered}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedCompanyInfo.membershipQuota.allDay.hasList ? (
                        <Upload className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {membershipStats && (
                        <div className="text-xs">
                          <div className="text-green-600 font-medium">
                            {membershipStats.allDay.paid}명
                          </div>
                          <div className="text-red-600">
                            {membershipStats.allDay.unpaid + membershipStats.allDay.partial}명
                          </div>
                        </div>
                      )}
                    </TableCell>
                    
                    {/* 오전권 */}
                    <TableCell className="text-center font-medium">
                      {selectedCompanyInfo.membershipQuota.morning.assigned}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedCompanyInfo.membershipQuota.morning.registered}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedCompanyInfo.membershipQuota.morning.hasList ? (
                        <Upload className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {membershipStats && (
                        <div className="text-xs">
                          <div className="text-green-600 font-medium">
                            {membershipStats.morning.paid}명
                          </div>
                          <div className="text-red-600">
                            {membershipStats.morning.unpaid + membershipStats.morning.partial}명
                          </div>
                        </div>
                      )}
                    </TableCell>
                    
                    {/* 저녁권 */}
                    <TableCell className="text-center font-medium">
                      {selectedCompanyInfo.membershipQuota.evening.assigned}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedCompanyInfo.membershipQuota.evening.registered}
                    </TableCell>
                    <TableCell className="text-center">
                      {selectedCompanyInfo.membershipQuota.evening.hasList ? (
                        <Upload className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {membershipStats && (
                        <div className="text-xs">
                          <div className="text-green-600 font-medium">
                            {membershipStats.evening.paid}명
                          </div>
                          <div className="text-red-600">
                            {membershipStats.evening.unpaid + membershipStats.evening.partial}명
                          </div>
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Switch 
                        checked={selectedCompanyInfo.status === 'active'} 
                        disabled 
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 전체 통계 카드 */}
      {comparisonData.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 등록자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.total}</div>
              <p className="text-xs text-muted-foreground">등록된 인원 수</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">결제완료</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalStats.paid}</div>
              <p className="text-xs text-muted-foreground">결제 완료자</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">미결제</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalStats.unpaid + totalStats.partial}</div>
              <p className="text-xs text-muted-foreground">결제 미완료자</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">결제율</CardTitle>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalStats.paidRate}%</div>
              <p className="text-xs text-muted-foreground">결제 완료율</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 상세 대조 결과 테이블 */}
      {comparisonData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>등록자 vs 결제내역 대조</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>사번</TableHead>
                    <TableHead>부서</TableHead>
                    <TableHead>등록일</TableHead>
                    <TableHead>회원권종류</TableHead>
                    <TableHead>결제상태</TableHead>
                    <TableHead>마지막결제일</TableHead>
                    <TableHead>총결제금액</TableHead>
                    <TableHead>사물함</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((item, index) => (
                    <TableRow key={`${item.registration.employee_id}-${index}`}>
                      <TableCell className="font-medium">
                        {item.registration.name}
                      </TableCell>
                      <TableCell>{item.registration.employee_id}</TableCell>
                      <TableCell>{item.registration.department || '-'}</TableCell>
                      <TableCell>
                        {new Date(item.registration.registered_at).toLocaleDateString('ko-KR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.registration.membership_type}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.lastPaymentDate ? 
                          new Date(item.lastPaymentDate).toLocaleDateString('ko-KR') : 
                          '-'
                        }
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.totalAmount ? `₩${item.totalAmount.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>
                        {item.registration.membership_type === '종일권' ? '있음' : '없음'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 계열사 미선택 시 안내 */}
      {!selectedCompany && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">계열사를 선택해주세요</h3>
            <p className="text-muted-foreground text-center">
              위에서 계열사를 선택하면 해당 계열사의 등록자/명단과 결제내역을 대조할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}