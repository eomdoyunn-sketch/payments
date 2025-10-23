"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, HomeIcon, FileTextIcon } from "lucide-react"

interface RegistrationCompleteCardProps {
  companyName?: string
  onHomeClick?: () => void
  onParqClick?: () => void
}

export function RegistrationCompleteCard({
  companyName = "반트",
  onHomeClick,
  onParqClick
}: RegistrationCompleteCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8 space-y-6">
        {/* 로고 영역 */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* 감사 메시지 */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">
              {companyName} 회원가입을
            </h1>
            <h1 className="text-xl font-bold text-foreground">
              해주셔서 감사합니다.
            </h1>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            회원님께서는 센터에 방문하셔서 상담 및 필요서류
            제출 후 정회원가입을 하실 수 있습니다.
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="space-y-3">
          <Button
            onClick={onHomeClick}
            className="w-full h-12 text-base font-medium"
            variant="default"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            홈화면
          </Button>
          
          <Button
            onClick={onParqClick}
            className="w-full h-12 text-base font-medium"
            variant="outline"
          >
            <FileTextIcon className="w-4 h-4 mr-2" />
            PAR-Q작성
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
