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

  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-3xl">결제가 실패했습니다</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>결제 처리 중 문제가 발생했습니다.</p>
            <p>다시 시도해 주시거나, 문제가 지속될 경우 고객센터로 문의해 주세요.</p>
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


