"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreditCard, Edit, Trash2, RefreshCw } from "lucide-react"
import { useOptimizedPayments } from "@/hooks/useOptimizedState"
import { usePaymentStatusDebounce } from "@/hooks/useDebouncedSave"
import { toast } from "sonner"

type PaymentData = {
  id: string
  payment_date: string
  company: string
  name: string
  email: string
  product_type: string
  price: number
  processed: boolean
  locker_number?: string
  memo?: string
  refund_reason?: string
  refunded_at?: string
}

type OptimizedPaymentDataTableProps = {
  initialPayments: PaymentData[]
  onProcessed?: (ids: string[]) => void
  onToggleProcessed?: (id: string) => void
  onUpdateLockerNumber?: (id: string, lockerNumber: string) => void
  onUpdateMemo?: (id: string, memo: string) => void
  onRefund?: (id: string, reason: string) => void
  className?: string
}

// 최적화된 결제 행 컴포넌트
const PaymentRow = React.memo(({ 
  payment, 
  onToggleProcessed, 
  onUpdateLockerNumber, 
  onUpdateMemo, 
  onRefund 
}: {
  payment: PaymentData
  onToggleProcessed?: (id: string) => void
  onUpdateLockerNumber?: (id: string, lockerNumber: string) => void
  onUpdateMemo?: (id: string, memo: string) => void
  onRefund?: (id: string, reason: string) => void
}) => {
  const [isEditingLocker, setIsEditingLocker] = React.useState(false)
  const [isEditingMemo, setIsEditingMemo] = React.useState(false)
  const [isRefunding, setIsRefunding] = React.useState(false)
  const [lockerNumber, setLockerNumber] = React.useState(payment.locker_number || '')
  const [memo, setMemo] = React.useState(payment.memo || '')
  const [refundReason, setRefundReason] = React.useState('')

  const handleToggleProcessed = React.useCallback(() => {
    onToggleProcessed?.(payment.id)
  }, [payment.id, onToggleProcessed])

  const handleUpdateLocker = React.useCallback(() => {
    onUpdateLockerNumber?.(payment.id, lockerNumber)
    setIsEditingLocker(false)
  }, [payment.id, lockerNumber, onUpdateLockerNumber])

  const handleUpdateMemo = React.useCallback(() => {
    onUpdateMemo?.(payment.id, memo)
    setIsEditingMemo(false)
  }, [payment.id, memo, onUpdateMemo])

  const handleRefund = React.useCallback(() => {
    if (!refundReason.trim()) {
      toast.error('환불 사유를 입력해주세요')
      return
    }
    onRefund?.(payment.id, refundReason)
    setIsRefunding(false)
    setRefundReason('')
  }, [payment.id, refundReason, onRefund])

  return (
    <tr className="border-b hover:bg-muted/20">
      {/* 결제일 */}
      <td className="p-3 text-sm">
        {new Date(payment.payment_date).toLocaleDateString('ko-KR')}
      </td>

      {/* 회사 */}
      <td className="p-3 text-sm">{payment.company}</td>

      {/* 이름 */}
      <td className="p-3 text-sm">{payment.name}</td>

      {/* 상품 */}
      <td className="p-3 text-sm">{payment.product_type}</td>

      {/* 금액 */}
      <td className="p-3 text-sm font-medium">
        ₩{payment.price.toLocaleString()}
      </td>

      {/* 사물함 번호 */}
      <td className="p-3 text-sm">
        {isEditingLocker ? (
          <div className="flex items-center gap-2">
            <Input
              value={lockerNumber}
              onChange={(e) => setLockerNumber(e.target.value)}
              className="w-20 h-8"
              placeholder="번호"
            />
            <Button size="sm" onClick={handleUpdateLocker}>
              저장
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditingLocker(false)}>
              취소
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{payment.locker_number || '-'}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingLocker(true)}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )}
      </td>

      {/* 처리 상태 */}
      <td className="p-3 text-center">
        <Button
          size="sm"
          variant={payment.processed ? "default" : "outline"}
          onClick={handleToggleProcessed}
        >
          {payment.processed ? '처리완료' : '처리대기'}
        </Button>
      </td>

      {/* 메모 */}
      <td className="p-3 text-sm">
        {isEditingMemo ? (
          <div className="space-y-2">
            <Textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full h-16"
              placeholder="메모를 입력하세요"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdateMemo}>
                저장
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditingMemo(false)}>
                취소
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-32">{payment.memo || '-'}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingMemo(true)}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
          </div>
        )}
      </td>

      {/* 액션 */}
      <td className="p-3">
        <div className="flex items-center gap-1">
          {!payment.refunded_at && (
            <Dialog open={isRefunding} onOpenChange={setIsRefunding}>
              <DialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  환불
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>환불 처리</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>환불 사유</Label>
                    <Textarea
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="환불 사유를 입력하세요"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleRefund}>환불 처리</Button>
                    <Button variant="outline" onClick={() => setIsRefunding(false)}>
                      취소
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          {payment.refunded_at && (
            <Badge variant="destructive">환불됨</Badge>
          )}
        </div>
      </td>
    </tr>
  )
})

PaymentRow.displayName = 'PaymentRow'

export function OptimizedPaymentDataTable({
  initialPayments,
  onProcessed,
  onToggleProcessed,
  onUpdateLockerNumber,
  onUpdateMemo,
  onRefund,
  className
}: OptimizedPaymentDataTableProps) {
  // 최적화된 상태 관리
  const {
    payments,
    togglePaymentStatus,
    updateLockerNumber,
    updateMemo,
    setPayments
  } = useOptimizedPayments(initialPayments)

  // 디바운스된 저장
  const { addChange: addPaymentChange, pendingCount, isSaving } = usePaymentStatusDebounce()

  // 처리 상태 토글 (즉시 UI 업데이트 + 디바운스된 저장)
  const handleToggleProcessed = React.useCallback((id: string) => {
    const payment = payments.find(p => p.id === id)
    if (!payment) return

    const newProcessed = !payment.processed
    togglePaymentStatus(id, newProcessed)
    addPaymentChange(id, { processed: newProcessed })
    
    toast.success(newProcessed ? '처리 완료로 변경되었습니다' : '미처리로 변경되었습니다')
  }, [payments, togglePaymentStatus, addPaymentChange])

  // 사물함 번호 업데이트
  const handleUpdateLockerNumber = React.useCallback((id: string, lockerNumber: string) => {
    updateLockerNumber(id, lockerNumber)
    toast.success('사물함 번호가 업데이트되었습니다')
  }, [updateLockerNumber])

  // 메모 업데이트
  const handleUpdateMemo = React.useCallback((id: string, memo: string) => {
    updateMemo(id, memo)
    toast.success('메모가 업데이트되었습니다')
  }, [updateMemo])

  // 환불 처리
  const handleRefund = React.useCallback((id: string, reason: string) => {
    onRefund?.(id, reason)
    toast.success('환불 처리가 완료되었습니다')
  }, [onRefund])

  const unprocessedCount = payments.filter(p => !p.processed).length
  const processedCount = payments.filter(p => p.processed).length

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            결제 내역 관리
            {pendingCount > 0 && (
              <Badge variant="secondary">
                저장 대기: {pendingCount}개
              </Badge>
            )}
            {isSaving && (
              <Badge variant="outline">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                저장 중...
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 통계 */}
            <div className="flex gap-4 text-sm">
              <div>전체: {payments.length}건</div>
              <div>처리완료: {processedCount}건</div>
              <div>처리대기: {unprocessedCount}건</div>
            </div>

            {/* 테이블 */}
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm font-medium">결제일</th>
                    <th className="p-3 text-left text-sm font-medium">회사</th>
                    <th className="p-3 text-left text-sm font-medium">이름</th>
                    <th className="p-3 text-left text-sm font-medium">상품</th>
                    <th className="p-3 text-left text-sm font-medium">금액</th>
                    <th className="p-3 text-left text-sm font-medium">사물함</th>
                    <th className="p-3 text-center text-sm font-medium">상태</th>
                    <th className="p-3 text-left text-sm font-medium">메모</th>
                    <th className="p-3 text-center text-sm font-medium">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <PaymentRow
                      key={payment.id}
                      payment={payment}
                      onToggleProcessed={handleToggleProcessed}
                      onUpdateLockerNumber={handleUpdateLockerNumber}
                      onUpdateMemo={handleUpdateMemo}
                      onRefund={handleRefund}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
