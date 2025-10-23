"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [paymentData, setPaymentData] = React.useState<any>(null)

  React.useEffect(() => {
    const processPayment = async () => {
      const paymentKey = searchParams.get('paymentKey')
      const orderId = searchParams.get('orderId')
      const amount = searchParams.get('amount')

      if (!paymentKey || !orderId || !amount) {
        setError('결제 정보가 올바르지 않습니다.')
        setIsProcessing(false)
        return
      }

      try {
        // sessionStorage에서 결제 정보 가져오기
        const paymentInfoStr = sessionStorage.getItem('pendingPaymentInfo')
        let paymentInfo = null
        
        if (paymentInfoStr) {
          try {
            paymentInfo = JSON.parse(paymentInfoStr)
            console.log('📦 결제 정보 로드:', paymentInfo)
            // 사용 완료 후 삭제
            sessionStorage.removeItem('pendingPaymentInfo')
          } catch (e) {
            console.warn('결제 정보 파싱 실패:', e)
          }
        }
        
        // 서버에 결제 승인 요청
        const response = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
            paymentInfo
          })
        })

        if (!response.ok) {
          let errorData = {}
          try {
            errorData = await response.json()
          } catch (jsonError) {
            console.warn('JSON 파싱 실패:', jsonError)
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
          }
          
          console.error('결제 승인 API 응답 오류:', {
            status: response.status,
            statusText: response.statusText,
            errorData,
            paymentKey: paymentKey?.substring(0, 10) + '...',
            orderId,
            amount
          })
          
          // 더 구체적인 오류 메시지 제공
          let errorMessage = errorData.error || errorData.message || `결제 승인에 실패했습니다. (${response.status})`
          
          // 환경 변수 관련 오류인 경우 특별 처리
          if (errorMessage.includes('시크릿 키가 설정되지 않았습니다')) {
            errorMessage = '결제 시스템 설정에 문제가 있습니다. 관리자에게 문의해주세요.'
          } else if (errorMessage.includes('토스페이먼츠 인증에 실패')) {
            errorMessage = '결제 시스템 인증에 문제가 있습니다. 잠시 후 다시 시도해주세요.'
          } else if (errorMessage.includes('이미 처리된 결제')) {
            errorMessage = '이미 처리된 결제입니다. 결제 내역을 확인해주세요.'
          } else if (errorMessage.includes('ALREADY_PROCESSED_PAYMENT')) {
            errorMessage = '이미 처리된 결제입니다. 결제 내역을 확인해주세요.'
          } else if (errorMessage.includes('payment_date') && errorMessage.includes('null value')) {
            errorMessage = '결제 데이터 저장 중 오류가 발생했습니다. 관리자에게 문의해주세요.'
          } else if (response.status === 401) {
            errorMessage = '인증에 실패했습니다. 다시 로그인해주세요.'
          } else if (response.status === 400) {
            errorMessage = '결제 정보가 올바르지 않습니다. 다시 시도해주세요.'
          } else if (response.status === 500) {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          }
          
          throw new Error(errorMessage)
        }

        const data = await response.json()
        
        // 이미 처리된 결제인 경우에도 성공으로 처리
        if (data.message === '이미 처리된 결제입니다.') {
          console.log('이미 처리된 결제로 확인됨:', data)
        }
        
        setPaymentData(data)
        setIsProcessing(false)
      } catch (err: any) {
        console.error('결제 처리 오류:', err)
        
        // 데이터베이스 스키마 오류인 경우 특별 처리
        if (err.message?.includes('데이터베이스 스키마 오류')) {
          setError('데이터베이스 설정에 문제가 있습니다. 관리자에게 문의해주세요.')
        } else if (err.message?.includes('토스페이먼츠 API')) {
          setError('결제 승인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        } else {
          setError(err.message || '결제 처리 중 오류가 발생했습니다.')
        }
        
        setIsProcessing(false)
      }
    }

    processPayment()
  }, [searchParams])

  if (isProcessing) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-16 text-center">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">결제 처리 중...</h2>
            <p className="text-muted-foreground">
              잠시만 기다려주세요. 결제를 확인하고 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-16 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">결제 실패</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => router.push('/')}>
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">결제가 완료되었습니다!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/30 p-6 rounded-lg space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문번호</span>
              <span className="font-medium">{paymentData?.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">결제금액</span>
              <span className="font-bold text-lg">
                ₩{paymentData?.totalAmount?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">결제방법</span>
              <span className="font-medium">{paymentData?.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">결제일시</span>
              <span className="font-medium">
                {paymentData?.approvedAt ? new Date(paymentData.approvedAt).toLocaleString('ko-KR') : '-'}
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>영수증은 등록하신 이메일로 발송됩니다.</p>
            <p>결제 내역은 마이페이지에서 확인하실 수 있습니다.</p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push('/mypage')}
            >
              결제 내역 확인
            </Button>
            <Button 
              className="flex-1"
              onClick={() => router.push('/')}
            >
              홈으로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


