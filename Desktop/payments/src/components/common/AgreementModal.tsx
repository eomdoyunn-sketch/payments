"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, X } from "lucide-react"

export type AgreementType = "personal" | "sensitive" | "utilization" | "service" | "privacy" | "marketing" | "shp" | "shp-data"

export type Agreement = {
  type: AgreementType
  title: string
  version: string
  content: string
  required: boolean
}

type AgreementModalProps = {
  agreement: Agreement
  open: boolean
  onOpenChange: (open: boolean) => void
  onAgree: (agreed: boolean) => void
  initialAgreed?: boolean
}

export function AgreementModal({
  agreement,
  open,
  onOpenChange,
  onAgree,
  initialAgreed = false
}: AgreementModalProps) {
  const [agreed, setAgreed] = React.useState(initialAgreed)

  const handleAgree = () => {
    onAgree(agreed)
    onOpenChange(false)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {agreement.title}
            <Badge variant="secondary" className="ml-auto">
              {agreement.version}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {agreement.required ? "필수 동의서" : "선택 동의서"} - 내용을 확인하신 후 동의해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 동의서 내용 */}
          <div className="h-[400px] w-full border rounded-md p-4 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {agreement.content}
              </div>
            </div>
          </div>

          {/* 동의 체크박스 */}
          <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-lg">
            <Checkbox
              id="agreement-check"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label
              htmlFor="agreement-check"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              위 내용을 확인하였으며, {agreement.required ? "필수" : "선택"} 동의에 {agreement.required ? "동의" : "동의"}합니다.
            </label>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              <X className="mr-2 h-4 w-4" />
              취소
            </Button>
            <Button 
              onClick={handleAgree}
              disabled={agreement.required && !agreed}
              className="min-w-[100px]"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {agreed ? "동의 완료" : "동의"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 동의서 목록을 표시하는 컴포넌트
type AgreementListProps = {
  agreements: Agreement[]
  onAgreementClick: (agreement: Agreement) => void
  agreedStatus: Record<AgreementType, boolean>
}

export function AgreementList({ 
  agreements, 
  onAgreementClick, 
  agreedStatus 
}: AgreementListProps) {
  return (
    <div className="space-y-3">
      {agreements.map((agreement) => (
        <div 
          key={agreement.type}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={() => onAgreementClick(agreement)}
        >
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{agreement.title}</span>
                <Badge variant={agreement.required ? "default" : "secondary"}>
                  {agreement.required ? "필수" : "선택"}
                </Badge>
                <Badge variant="outline">{agreement.version}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {agreement.content.substring(0, 100)}...
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {agreedStatus[agreement.type] ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
