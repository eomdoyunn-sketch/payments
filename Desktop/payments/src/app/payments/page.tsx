import { getAllPayments } from '@/app/actions/payments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

interface Payment {
  id: string
  payment_date: string
  company: string
  employee_id: string
  name: string
  gender: '남' | '여'
  membership_type: string
  membership_period: number
  price: number
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  created_at: string
}

export default async function PaymentsPage() {
  const payments = await getAllPayments()

  // 통계 계산
  const totalPayments = payments.length
  const totalAmount = payments.reduce((sum, p) => sum + p.price, 0)
  const completedPayments = payments.filter(p => p.status === 'completed').length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">결제 내역</h1>
          <p className="text-muted-foreground mt-2">
            모든 결제 정보를 확인할 수 있습니다
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 결제 건수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPayments.toLocaleString()}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 결제 금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAmount.toLocaleString()}원</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 결제</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments.toLocaleString()}건</div>
          </CardContent>
        </Card>
      </div>

      {/* 결제 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>결제 내역</CardTitle>
          <CardDescription>
            {totalPayments}건의 결제가 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                결제 내역이 없습니다
              </div>
            ) : (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* 프로필 아이콘 */}
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold">
                        {payment.name.charAt(0)}
                      </span>
                    </div>

                    {/* 결제자 정보 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{payment.name}</h3>
                        <Badge variant={payment.gender === '남' ? 'default' : 'secondary'}>
                          {payment.gender}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {payment.company} · 사번: {payment.employee_id}
                      </div>
                    </div>

                    {/* 결제 정보 */}
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {payment.price.toLocaleString()}원
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(payment.payment_date), 'yyyy년 MM월 dd일', {
                          locale: ko,
                        })}
                      </div>
                    </div>

                    {/* 상품 정보 */}
                    <div className="text-right min-w-[150px]">
                      <Badge variant="outline" className="text-sm">
                        {payment.membership_type}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {payment.membership_period}개월
                      </div>
                    </div>

                    {/* 상태 */}
                    <div className="min-w-[80px] text-right">
                      {payment.status === 'completed' && (
                        <Badge variant="default" className="bg-green-600">
                          완료
                        </Badge>
                      )}
                      {payment.status === 'pending' && (
                        <Badge variant="secondary">대기</Badge>
                      )}
                      {payment.status === 'cancelled' && (
                        <Badge variant="destructive">취소</Badge>
                      )}
                      {payment.status === 'refunded' && (
                        <Badge variant="destructive">환불</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
