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
import { Switch } from "@/components/ui/switch"
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

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
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료'
      case 'pending':
        return '대기'
      case 'cancelled':
        return '취소'
      case 'refunded':
        return '환불'
      default:
        return status
    }
  }

  const getProcessedText = (processed: boolean) => {
    return processed ? '처리완료' : '미처리'
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
            <TableHead>금액</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>처리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {format(new Date(payment.payment_date), 'yyyy년 MM월 dd일', { locale: ko })}
              </TableCell>
              <TableCell>{payment.company}</TableCell>
              <TableCell>{payment.employee_id}</TableCell>
              <TableCell>{payment.name}</TableCell>
              <TableCell>{payment.gender}</TableCell>
              <TableCell>
                {payment.membership_type} ({payment.membership_period}개월)
              </TableCell>
              <TableCell>₩{payment.price.toLocaleString()}</TableCell>
              <TableCell>{getStatusText(payment.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{getProcessedText(payment.processed)}</span>
                  <Switch
                    checked={payment.processed}
                    onCheckedChange={(checked) => 
                      onToggleProcessed(payment.id, checked)
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

