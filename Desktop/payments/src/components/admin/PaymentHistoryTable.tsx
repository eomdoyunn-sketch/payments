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
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn, formatDateForDisplay } from "@/lib/utils"
import { Edit, Save, X } from "lucide-react"

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

type PaymentHistoryTableProps = {
  data: PaymentData[]
  onToggleProcessed: (paymentId: string, processed: boolean) => void
  onUpdateLockerNumber: (paymentId: string, lockerNumber: string) => void
  onUpdateMemo: (paymentId: string, memo: string) => void
}

export function PaymentHistoryTable({
  data,
  onToggleProcessed,
  onUpdateLockerNumber,
  onUpdateMemo
}: PaymentHistoryTableProps) {
  const [editingLocker, setEditingLocker] = React.useState<string | null>(null)
  const [editingMemo, setEditingMemo] = React.useState<string | null>(null)
  const [lockerNumber, setLockerNumber] = React.useState("")
  const [memo, setMemo] = React.useState("")

  const handleEditLocker = (payment: PaymentData) => {
    setEditingLocker(payment.id)
    setLockerNumber(payment.locker_number || "")
  }

  const handleSaveLocker = (paymentId: string) => {
    onUpdateLockerNumber(paymentId, lockerNumber)
    setEditingLocker(null)
    setLockerNumber("")
  }

  const handleCancelLocker = () => {
    setEditingLocker(null)
    setLockerNumber("")
  }

  const handleEditMemo = (payment: PaymentData) => {
    setEditingMemo(payment.id)
    setMemo(payment.memo || "")
  }

  const handleSaveMemo = (paymentId: string) => {
    onUpdateMemo(paymentId, memo)
    setEditingMemo(null)
    setMemo("")
  }

  const handleCancelMemo = () => {
    setEditingMemo(null)
    setMemo("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">완료</Badge>
      case 'pending':
        return <Badge variant="secondary">대기</Badge>
      case 'cancelled':
        return <Badge variant="destructive">취소</Badge>
      case 'refunded':
        return <Badge variant="outline">환불</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getProcessedBadge = (processed: boolean) => {
    return processed ? (
      <Badge variant="default">처리완료</Badge>
    ) : (
      <Badge variant="secondary">미처리</Badge>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>결제일</TableHead>
            <TableHead>회사</TableHead>
            <TableHead>사번</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>성별</TableHead>
            <TableHead>회원권</TableHead>
            <TableHead>사물함</TableHead>
            <TableHead>금액</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>처리</TableHead>
            <TableHead>메모</TableHead>
            <TableHead>관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                {formatDateForDisplay(payment.payment_date)}
              </TableCell>
              <TableCell>{payment.company}</TableCell>
              <TableCell>{payment.employee_id}</TableCell>
              <TableCell>{payment.name}</TableCell>
              <TableCell>{payment.gender}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{payment.membership_type}</div>
                  <div className="text-sm text-muted-foreground">
                    {payment.membership_period}개월
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {payment.has_locker ? (
                  <div className="space-y-1">
                    <div className="font-medium">
                      {editingLocker === payment.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={lockerNumber}
                            onChange={(e) => setLockerNumber(e.target.value)}
                            placeholder="사물함 번호"
                            className="w-20"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSaveLocker(payment.id)}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelLocker}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{payment.locker_number || '미할당'}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditLocker(payment)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {payment.locker_period}개월
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">없음</span>
                )}
              </TableCell>
              <TableCell className="font-medium">
                ₩{payment.price.toLocaleString()}
              </TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={payment.processed}
                    onCheckedChange={(checked) => 
                      onToggleProcessed(payment.id, checked)
                    }
                  />
                  {getProcessedBadge(payment.processed)}
                </div>
              </TableCell>
              <TableCell>
                {editingMemo === payment.id ? (
                  <div className="flex items-center gap-2">
                    <Textarea
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="메모를 입력하세요"
                      className="w-32 h-16"
                    />
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSaveMemo(payment.id)}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelMemo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm max-w-32 truncate">
                      {payment.memo || '메모 없음'}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditMemo(payment)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      상세보기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>결제 상세 정보</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">결제 ID</Label>
                          <p className="text-sm text-muted-foreground">{payment.id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">결제일</Label>
                          <p className="text-sm text-muted-foreground">
                            {formatDateForDisplay(payment.payment_date)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">회사</Label>
                          <p className="text-sm text-muted-foreground">{payment.company}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">사번</Label>
                          <p className="text-sm text-muted-foreground">{payment.employee_id}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">이름</Label>
                          <p className="text-sm text-muted-foreground">{payment.name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">성별</Label>
                          <p className="text-sm text-muted-foreground">{payment.gender}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">회원권</Label>
                          <p className="text-sm text-muted-foreground">
                            {payment.membership_type} ({payment.membership_period}개월)
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">사물함</Label>
                          <p className="text-sm text-muted-foreground">
                            {payment.has_locker 
                              ? `${payment.locker_number || '미할당'} (${payment.locker_period}개월)`
                              : '없음'
                            }
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">결제 금액</Label>
                          <p className="text-sm text-muted-foreground">
                            ₩{payment.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">결제 상태</Label>
                          <p className="text-sm text-muted-foreground">{payment.status}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">처리 상태</Label>
                          <p className="text-sm text-muted-foreground">
                            {payment.processed ? '처리완료' : '미처리'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">토스 결제키</Label>
                          <p className="text-sm text-muted-foreground">
                            {payment.toss_payment_key || '없음'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">토스 주문ID</Label>
                          <p className="text-sm text-muted-foreground">
                            {payment.toss_order_id || '없음'}
                          </p>
                        </div>
                      </div>
                      {payment.memo && (
                        <div>
                          <Label className="text-sm font-medium">메모</Label>
                          <p className="text-sm text-muted-foreground">{payment.memo}</p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

