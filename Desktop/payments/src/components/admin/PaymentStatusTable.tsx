"use client"

import * as React from "react"
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
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download,
  RefreshCw,
  FileSpreadsheet
} from "lucide-react"
import { cn } from "@/lib/utils"

type ExcelMember = {
  사번: string
  이름: string
  이메일?: string
  연락처?: string
  부서?: string
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

type PaymentStatusData = {
  member: ExcelMember
  payment?: PaymentData
  status: 'paid' | 'unpaid' | 'partial'
  lastPaymentDate?: string
  totalAmount?: number
}

type PaymentStatusTableProps = {
  data: PaymentStatusData[]
  onRefresh?: () => void
  loading?: boolean
}

export function PaymentStatusTable({
  data,
  onRefresh,
  loading = false
}: PaymentStatusTableProps) {
  const [sortField, setSortField] = React.useState<keyof PaymentStatusData>('member')
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  // 통계 계산
  const stats = React.useMemo(() => {
    const total = data.length
    const paid = data.filter(item => item.status === 'paid').length
    const unpaid = data.filter(item => item.status === 'unpaid').length
    const partial = data.filter(item => item.status === 'partial').length
    const paidRate = total > 0 ? Math.round((paid / total) * 100) : 0

    return {
      total,
      paid,
      unpaid,
      partial,
      paidRate
    }
  }, [data])

  // 정렬된 데이터
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortField === 'member') {
        aValue = a.member.이름
        bValue = b.member.이름
      } else if (sortField === 'status') {
        aValue = a.status
        bValue = b.status
      } else if (sortField === 'lastPaymentDate') {
        aValue = a.lastPaymentDate || ''
        bValue = b.lastPaymentDate || ''
      } else if (sortField === 'totalAmount') {
        aValue = a.totalAmount || 0
        bValue = b.totalAmount || 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortField, sortDirection])

  // 정렬 핸들러
  const handleSort = (field: keyof PaymentStatusData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

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
    const exportData = data.map((item, index) => ({
      번호: index + 1,
      사번: item.member.사번,
      이름: item.member.이름,
      부서: item.member.부서 || '',
      이메일: item.member.이메일 || '',
      연락처: item.member.연락처 || '',
      결제상태: item.status === 'paid' ? '결제완료' : item.status === 'unpaid' ? '미결제' : '부분결제',
      마지막결제일: item.lastPaymentDate || '',
      총결제금액: item.totalAmount || 0,
      회원권: item.payment?.membership_type || '',
      사물함: item.payment?.has_locker ? '있음' : '없음'
    }))

    // XLSX 라이브러리를 사용하여 엑셀 파일 생성
    const XLSX = require('xlsx')
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "결제상태")
    XLSX.writeFile(wb, `결제상태_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="space-y-4">
      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 명단</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">업로드된 명단 수</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">결제완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">결제 완료자</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">미결제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unpaid}</div>
            <p className="text-xs text-muted-foreground">결제 미완료자</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">결제율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paidRate}%</div>
            <p className="text-xs text-muted-foreground">결제 완료율</p>
          </CardContent>
        </Card>
      </div>

      {/* 테이블 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              결제 상태 확인
            </CardTitle>
            <div className="flex gap-2">
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
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <Download className="h-4 w-4 mr-2" />
                엑셀 내보내기
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('member')}
                  >
                    이름 {sortField === 'member' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>사번</TableHead>
                  <TableHead>부서</TableHead>
                  <TableHead>연락처</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('status')}
                  >
                    결제상태 {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('lastPaymentDate')}
                  >
                    마지막결제일 {sortField === 'lastPaymentDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('totalAmount')}
                  >
                    총결제금액 {sortField === 'totalAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>회원권</TableHead>
                  <TableHead>사물함</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item, index) => (
                  <TableRow key={`${item.member.사번}-${index}`}>
                    <TableCell className="font-medium">
                      {item.member.이름}
                    </TableCell>
                    <TableCell>{item.member.사번}</TableCell>
                    <TableCell>{item.member.부서 || '-'}</TableCell>
                    <TableCell>{item.member.연락처 || '-'}</TableCell>
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
                      {item.payment?.membership_type || '-'}
                    </TableCell>
                    <TableCell>
                      {item.payment?.has_locker ? 
                        `${item.payment.locker_number || '미할당'} (${item.payment.locker_period}개월)` : 
                        '없음'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

