"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

type Agreement = {
  type: "service" | "privacy" | "marketing"
  title: string
  version: string
  content: string
  required: boolean
  enabled: boolean
  lastModified: string
}

type AgreementPreviewProps = {
  agreement: Agreement
}

export function AgreementPreview({ agreement }: AgreementPreviewProps) {
  const getAgreementTypeLabel = (type: string) => {
    switch (type) {
      case "service":
        return "서비스 이용약관"
      case "privacy":
        return "개인정보 동의서"
      case "marketing":
        return "마케팅 동의서"
      default:
        return type
    }
  }

  const getAgreementTypeBadge = (type: string) => {
    switch (type) {
      case "service":
        return <Badge variant="default">서비스</Badge>
      case "privacy":
        return <Badge variant="destructive">개인정보</Badge>
      case "marketing":
        return <Badge variant="secondary">마케팅</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getAgreementTypeBadge(agreement.type)}
            <CardTitle>{agreement.title}</CardTitle>
            <Badge variant="outline">{agreement.version}</Badge>
            {agreement.required && (
              <Badge variant="destructive">필수</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            마지막 수정: {agreement.lastModified}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 동의서 내용 */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {agreement.content}
            </div>
          </div>

          <Separator />

          {/* 동의서 정보 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">동의서 타입:</span>
              <span className="ml-2">{getAgreementTypeLabel(agreement.type)}</span>
            </div>
            <div>
              <span className="font-medium">버전:</span>
              <span className="ml-2">{agreement.version}</span>
            </div>
            <div>
              <span className="font-medium">필수 여부:</span>
              <span className="ml-2">{agreement.required ? '필수' : '선택'}</span>
            </div>
            <div>
              <span className="font-medium">활성화 상태:</span>
              <span className="ml-2">{agreement.enabled ? '활성' : '비활성'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

