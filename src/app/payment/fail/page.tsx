"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export default function PaymentFailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const errorCode = searchParams.get('code')
  const errorMessage = searchParams.get('message')
  
  // 결제 취소인지 확인
  const isCancelled = errorCode === 'USER_CANCEL' || 
                     errorMessage?.includes('취소') || 
                     errorMessage?.includes('cancel')

  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          {isCancelled ? (
            <>
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <CardTitle className="text-3xl text-yellow-700">결제가 취소되었습니다</CardTitle>
            </>
          ) : (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-3xl">결제가 실패했습니다</CardTitle>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {!isCancelled && (errorCode || errorMessage) && (
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg space-y-2">
              {errorCode && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">오류 코드</span>
                  <span className="font-medium text-red-700">{errorCode}</span>
                </div>
              )}
              {errorMessage && (
                <div>
                  <span className="text-muted-foreground block mb-1">오류 메시지</span>
                  <p className="font-medium text-red-700">{decodeURIComponent(errorMessage)}</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground space-y-2">
            {isCancelled ? (
              <>
                <p>결제가 취소되었습니다.</p>
                <p>다시 결제를 원하시면 이전 페이지로 돌아가서 다시 시도해주세요.</p>
              </>
            ) : (
              <>
                <p>결제 처리 중 문제가 발생했습니다.</p>
                <p>다시 시도해 주시거나, 문제가 지속될 경우 고객센터로 문의해 주세요.</p>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.back()}
            >
              이전으로
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


