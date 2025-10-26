"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useConsentAgreements } from "@/hooks/useConsentAgreements"

interface PrivacyPolicyModalProps {
  isOpen?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

const FALLBACK_PRIVACY_POLICY =
  "현재 등록된 개인정보처리방침이 없습니다. 관리자 페이지에서 내용을 업데이트해 주세요."

export function PrivacyPolicyModal({ isOpen, onClose, children }: PrivacyPolicyModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = typeof isOpen === "boolean"
  const open = isControlled ? Boolean(isOpen) : internalOpen

  const { agreements, loading } = useConsentAgreements(["privacy_policy"], {
    skip: !open,
  })

  const privacyPolicy = agreements["privacy_policy"]
  const content = privacyPolicy?.content || FALLBACK_PRIVACY_POLICY
  const title = privacyPolicy?.title ?? "개인정보처리방침"
  // 메타 정보(버전/수정일)는 표시하지 않습니다.

  const handleOpenChange = (nextState: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextState)
    }

    if (!nextState) {
      onClose?.()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="link" className="p-0 text-sm font-medium">
            개인정보처리방침
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col w-[50vmin] h-[50vmin] max-w-[90vw] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6 py-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">개인정보처리방침을 불러오는 중입니다...</p>
          ) : (
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {content}
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-end px-6 py-4 border-t shrink-0">
          <Button onClick={() => handleOpenChange(false)}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
