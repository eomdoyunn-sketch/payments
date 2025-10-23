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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn, calculateEndDate, formatDateForDisplay } from "@/lib/utils"
import { RotateCcw, AlertTriangle } from "lucide-react"

type PaymentData = {
  id: number
  paymentDate: string
  paymentTime?: string
  company: string
  empNo?: string
  employeeId?: string
  name: string
  gender: "남" | "여"
  membershipType: string
  membershipPeriod: number
  hasLocker: boolean
  lockerPeriod?: number
  price: number
  status?: string
  processed: boolean
  lockerNumber?: string
  memo?: string
  refunded?: boolean
  refundDate?: string
  refundReason?: string
  toss_payment_key?: string
}

type PaymentDataTableProps = {
  data: PaymentData[]
  onProcessed?: (ids: number[]) => void
  onToggleProcessed?: (id: number) => void
  onUpdateLockerNumber?: (id: number, lockerNumber: string) => void
  onUpdateMemo?: (id: number, memo: string) => void
  onRefund?: (id: number, reason: string) => void
  settings?: {
    membershipStartDate?: string
    membershipPeriod?: number
    lockerStartDate?: string
    lockerPeriod?: number
  }
  className?: string
}

export function PaymentDataTable({
  data,
  onProcessed,
  onToggleProcessed,
  onUpdateLockerNumber,
  onUpdateMemo,
  onRefund,
  settings,
  className
}: PaymentDataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "unprocessed" | "processed">("all")
  const [companyFilter, setCompanyFilter] = React.useState<string>("all")
  const [memoStates, setMemoStates] = React.useState<Record<number, string>>({})
  const [openMemoId, setOpenMemoId] = React.useState<number | null>(null)
  const [refundStates, setRefundStates] = React.useState<Record<number, string>>({})
  const [openRefundId, setOpenRefundId] = React.useState<number | null>(null)

  // 계열사 목록 추출
  const companies = React.useMemo(() => {
    const uniqueCompanies = Array.from(new Set(data.map(d => d.company)))
    return uniqueCompanies.sort()
  }, [data])

  // 필터링
  const filteredData = React.useMemo(() => {
    let filtered = data

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // 계열사 필터
    if (companyFilter !== "all") {
      filtered = filtered.filter((row) => row.company === companyFilter)
    }

    // 상태 필터
    if (statusFilter === "unprocessed") {
      filtered = filtered.filter((row) => !row.processed)
    } else if (statusFilter === "processed") {
      filtered = filtered.filter((row) => row.processed)
    }

    return filtered
  }, [data, searchQuery, companyFilter, statusFilter])


  // 단일 처리
  const handleProcessSingle = (id: number) => {
    onProcessed?.([id])
  }

  // 메모 상태 초기화
  React.useEffect(() => {
    const initialMemoStates: Record<number, string> = {}
    data.forEach(row => {
      initialMemoStates[row.id] = row.memo || ""
    })
    setMemoStates(initialMemoStates)
  }, [data])

  // 메모 저장
  const handleSaveMemo = (id: number) => {
    const memoValue = memoStates[id] || ""
    onUpdateMemo?.(id, memoValue)
    setOpenMemoId(null) // 모달 닫기
  }

  // 메모 자동 저장 (모달 닫힐 때)
  const handleAutoSaveMemo = (id: number) => {
    const memoValue = memoStates[id] || ""
    onUpdateMemo?.(id, memoValue)
  }

  // 환불 상태 초기화
  React.useEffect(() => {
    const initialRefundStates: Record<number, string> = {}
    data.forEach(row => {
      initialRefundStates[row.id] = row.refundReason || ""
    })
    setRefundStates(initialRefundStates)
  }, [data])

  // 환불 처리
  const handleRefund = (id: number) => {
    const refundReason = refundStates[id] || ""
    if (!refundReason.trim()) {
      alert("환불 사유를 입력해주세요.")
      return
    }
    onRefund?.(id, refundReason)
    setOpenRefundId(null) // 모달 닫기
  }

  // 이용기간 계산 함수
  const getUsagePeriod = (payment: PaymentData) => {
    if (!settings) return null
    
    const membershipStart = settings.membershipStartDate || '2025-01-01'
    const membershipEnd = calculateEndDate(membershipStart, payment.membershipPeriod)
    const lockerStart = settings.lockerStartDate || '2025-01-01'
    const lockerEnd = calculateEndDate(lockerStart, payment.lockerPeriod || 0)
    
    return {
      membership: {
        start: formatDateForDisplay(membershipStart),
        end: formatDateForDisplay(membershipEnd)
      },
      locker: payment.hasLocker ? {
        start: formatDateForDisplay(lockerStart),
        end: formatDateForDisplay(lockerEnd)
      } : null
    }
  }

  // 메모 삭제
  const handleDeleteMemo = (id: number) => {
    setMemoStates(prev => ({ ...prev, [id]: "" }))
    onUpdateMemo?.(id, "")
  }

  const unprocessedCount = data.filter(d => !d.processed).length
  const processedCount = data.filter(d => d.processed).length

  return (
    <div className={cn("space-y-4", className)}>
      {/* 상단 컨트롤 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto flex-wrap">
          <Input
            placeholder="계열사, 이름, 사번으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          
          <Select value={companyFilter} onValueChange={(value: string) => setCompanyFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="계열사" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 계열사</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={(value: "all" | "unprocessed" | "processed") => setStatusFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 ({data.length})</SelectItem>
              <SelectItem value="unprocessed">미처리 ({unprocessedCount})</SelectItem>
              <SelectItem value="processed">처리완료 ({processedCount})</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* 통계 요약 */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
            미처리: {filteredData.filter(d => !d.processed).length}건
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            처리완료: {filteredData.filter(d => d.processed).length}건
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground ml-auto">
          {(companyFilter !== "all" || statusFilter !== "all" || searchQuery) ? (
            <>
              <span className="font-medium text-primary">필터링됨: {filteredData.length}건</span>
              <span className="mx-2">|</span>
              <span>전체: {data.length}건</span>
            </>
          ) : (
            <span>총 {data.length}건</span>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <div className="rounded-md border border-gray-300 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b-2 border-gray-300">
              <TableHead className="w-[60px] text-center font-bold text-gray-700 border-r border-gray-200">No</TableHead>
              <TableHead className="w-[100px] text-center font-bold text-gray-700 border-r border-gray-200">결제일시</TableHead>
              <TableHead className="w-[100px] text-center font-bold text-gray-700 border-r border-gray-200">계열사</TableHead>
              <TableHead className="w-[80px] text-center font-bold text-gray-700 border-r border-gray-200">사번</TableHead>
              <TableHead className="w-[80px] text-center font-bold text-gray-700 border-r border-gray-200">이름</TableHead>
              <TableHead className="w-[60px] text-center font-bold text-gray-700 border-r border-gray-200">성별</TableHead>
              <TableHead className="w-[80px] text-center font-bold text-gray-700 border-r border-gray-200">회원권</TableHead>
              <TableHead className="w-[80px] text-center font-bold text-gray-700 border-r border-gray-200">기간</TableHead>
              <TableHead className="w-[120px] text-center font-bold text-gray-700 border-r border-gray-200">이용기간</TableHead>
              <TableHead className="w-[80px] text-center font-bold text-gray-700 border-r border-gray-200">사물함</TableHead>
              <TableHead className="w-[80px] text-center font-bold text-gray-700 border-r border-gray-200">사물함번호</TableHead>
              <TableHead className="w-[100px] text-center font-bold text-gray-700 border-r border-gray-200">금액</TableHead>
              <TableHead className="w-[100px] text-center font-bold text-gray-700 border-r border-gray-200">메모</TableHead>
              <TableHead className="w-[100px] text-center font-bold text-gray-700 border-r border-gray-200">상태</TableHead>
              <TableHead className="w-[80px] text-center font-bold text-gray-700 border-r border-gray-200">등록</TableHead>
              <TableHead className="w-[80px] text-center font-bold text-gray-700">환불</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={15}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchQuery || statusFilter !== "all" 
                    ? "검색 결과가 없습니다." 
                    : "결제 내역이 없습니다."}
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "hover:bg-blue-50 transition-colors",
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                  )}
                >
                  <TableCell className="w-[60px] text-center font-medium border-r border-gray-100">{index + 1}</TableCell>
                  <TableCell className="w-[100px] text-center border-r border-gray-100">
                    <div className="text-sm">
                      <div>{row.paymentDate}</div>
                      {row.paymentTime && <div className="text-muted-foreground text-xs">{row.paymentTime}</div>}
                    </div>
                  </TableCell>
                  <TableCell className="w-[100px] text-center border-r border-gray-100">{row.company}</TableCell>
                  <TableCell className="w-[80px] text-center font-mono text-sm border-r border-gray-100">{row.empNo || row.employeeId}</TableCell>
                  <TableCell className="w-[80px] text-center font-medium border-r border-gray-100">{row.name}</TableCell>
                  <TableCell className="w-[60px] text-center border-r border-gray-100">{row.gender}</TableCell>
                  <TableCell className="w-[80px] text-center border-r border-gray-100">{row.membershipType}</TableCell>
                  <TableCell className="w-[80px] text-center border-r border-gray-100">{row.membershipPeriod}개월</TableCell>
                  <TableCell className="w-[120px] text-center border-r border-gray-100">
                    {(() => {
                      const usagePeriod = getUsagePeriod(row)
                      if (!usagePeriod) return <span className="text-muted-foreground text-xs">-</span>
                      
                      return (
                        <div className="text-xs space-y-1">
                          <div className="font-medium">
                            {usagePeriod.membership.start} ~ {usagePeriod.membership.end}
                          </div>
                          {usagePeriod.locker && (
                            <div className="text-muted-foreground">
                              사물함: {usagePeriod.locker.start} ~ {usagePeriod.locker.end}
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </TableCell>
                  <TableCell className="w-[80px] text-center border-r border-gray-100">
                    {row.hasLocker ? `${row.lockerPeriod}개월` : "없음"}
                  </TableCell>
                  <TableCell className="w-[80px] text-center border-r border-gray-100">
                    {row.hasLocker ? (
                      <Input
                        placeholder="번호"
                        value={row.lockerNumber || ""}
                        onChange={(e) => onUpdateLockerNumber?.(row.id, e.target.value)}
                        className="h-5 text-xs text-center"
                        size={1}
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="w-[100px] text-right font-medium border-r border-gray-100">
                    {row.price.toLocaleString()}원
                  </TableCell>
                  <TableCell className="w-[100px] text-center border-r border-gray-100">
                    <div className="flex justify-center">
                      <Dialog open={openMemoId === row.id} onOpenChange={(open) => {
                        if (!open) {
                          // 모달이 닫힐 때 자동 저장
                          handleAutoSaveMemo(row.id)
                        }
                        setOpenMemoId(open ? row.id : null)
                      }}>
                        <DialogTrigger asChild>
                          <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden border-transparent bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                            {row.memo ? "메모" : "메모+"}
                          </span>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>메모 관리</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">현재 메모</label>
                              <Textarea
                                placeholder="메모를 입력하세요..."
                                value={memoStates[row.id] || ""}
                                onChange={(e) => setMemoStates(prev => ({ ...prev, [row.id]: e.target.value }))}
                                className="mt-1"
                                rows={4}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteMemo(row.id)}
                              >
                                삭제
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSaveMemo(row.id)}
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                저장
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell className="w-[100px] text-center border-r border-gray-100">
                    <div className="flex justify-center">
                      {row.processed ? (
                        <Badge className="bg-primary/80 hover:bg-primary/90 h-7 px-2 text-xs flex items-center justify-center">
                          완료
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground border-muted h-7 px-2 text-xs flex items-center justify-center">
                          미처리
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[80px] text-center border-r border-gray-100">
                    <div className="flex justify-center">
                      {!row.processed ? (
                        <span 
                          onClick={() => handleProcessSingle(row.id)}
                          className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden border-transparent bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        >
                          확인
                        </span>
                      ) : (
                        <span 
                          onClick={() => onToggleProcessed?.(row.id)}
                          className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden border-transparent bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        >
                          되돌리기
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[80px] text-center">
                    <div className="flex justify-center">
                      {row.refunded ? (
                        <div className="flex flex-col items-center space-y-1">
                          <Badge variant="destructive" className="text-xs">
                            환불완료
                          </Badge>
                          {row.refundDate && (
                            <span className="text-xs text-muted-foreground">
                              {row.refundDate}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Dialog open={openRefundId === row.id} onOpenChange={(open) => setOpenRefundId(open ? row.id : null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                              disabled={!row.toss_payment_key}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              환불
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                환불 처리
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-muted/50 p-4 rounded-lg">
                                <h4 className="font-medium mb-2">결제 정보</h4>
                                <div className="text-sm space-y-1">
                                  <div>이름: {row.name}</div>
                                  <div>회원권: {row.membershipType} ({row.membershipPeriod}개월)</div>
                                  {row.hasLocker && <div>사물함: {row.lockerPeriod}개월</div>}
                                  <div>금액: ₩{row.price.toLocaleString()}</div>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">환불 사유 *</label>
                                <Textarea
                                  placeholder="환불 사유를 입력하세요..."
                                  value={refundStates[row.id] || ""}
                                  onChange={(e) => setRefundStates(prev => ({ ...prev, [row.id]: e.target.value }))}
                                  className="mt-1"
                                  rows={3}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setOpenRefundId(null)}
                                >
                                  취소
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleRefund(row.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  환불 처리
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 안내 메시지 */}
      <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <p className="font-medium mb-2">💡 사용 방법</p>
        <ol className="space-y-1 list-decimal list-inside">
          <li>결제 내역을 확인하고 입장 프로그램에 회원권과 사물함을 등록하세요</li>
          <li>입장 프로그램 등록 완료 후 &quot;확인&quot; 버튼을 클릭하세요</li>
          <li>각 건마다 개별적으로 &quot;확인&quot; 버튼을 클릭하여 처리하세요</li>
          <li>처리 완료된 건은 회색으로 표시되며, 필터에서 숨길 수 있습니다</li>
          <li>계열사 필터와 상태 필터를 조합하여 원하는 내역만 확인할 수 있습니다 (예: 특정 계열사의 미처리 건만 보기)</li>
        </ol>
      </div>
    </div>
  )
}
