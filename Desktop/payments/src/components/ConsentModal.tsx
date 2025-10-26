"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Shield, CheckCircle, XCircle, ChevronRight } from "lucide-react"

interface ConsentAgreement {
  id: string
  title: string
  content: string
  version: string
  is_active: boolean
  is_required: boolean
  has_detail_view: boolean
}

interface ConsentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConsentComplete: () => void
}

export function ConsentModal({ open, onOpenChange, onConsentComplete }: ConsentModalProps) {
  const supabase = createClient()
  const [agreements, setAgreements] = React.useState<ConsentAgreement[]>([])
  const [consents, setConsents] = React.useState<Record<string, boolean>>({})
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  // 활성화된 동의 전문 가져오기
  const fetchAgreements = async () => {
    try {
      // 먼저 인증 상태 확인
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.warn('사용자가 로그인되지 않았습니다. 공개 데이터만 조회합니다.')
        // 로그인하지 않은 사용자도 동의 전문을 볼 수 있도록 공개 조회
        const { data, error } = await supabase
          .from('consent_agreements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true })

        if (error) throw error
        setAgreements(data || [])
        return
      }

      // 로그인된 사용자의 경우 정상 조회
      const { data, error } = await supabase
        .from('consent_agreements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error
      setAgreements(data || [])
    } catch (error) {
      console.error('동의 전문 조회 실패:', error)
      toast.error('동의 전문을 불러오는데 실패했습니다.')
    }
  }

  React.useEffect(() => {
    if (open) {
      fetchAgreements()
    }
  }, [open])

  // 동의 상태 변경
  const handleConsentChange = (agreementId: string, consented: boolean) => {
    setConsents(prev => ({
      ...prev,
      [agreementId]: consented
    }))
  }

  // 전체 동의/해제
  const handleAllConsent = (checked: boolean) => {
    const newConsents: Record<string, boolean> = {}
    agreements.forEach(agreement => {
      newConsents[agreement.id] = checked
    })
    setConsents(newConsents)
  }

  // 모든 동의 체크
  const allConsented = agreements.length > 0 && agreements.every(agreement => consents[agreement.id])
  const requiredConsented = agreements.filter(a => a.is_required).every(agreement => consents[agreement.id])

  // 동의 제출
  const handleSubmit = async () => {
    if (!requiredConsented) {
      toast.error('모든 필수 동의를 완료해주세요.')
      return
    }

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // 로그인하지 않은 사용자의 경우 로컬에서만 동의 처리
        console.log('로그인하지 않은 사용자의 동의 처리')
        toast.success('동의가 완료되었습니다.')
        onConsentComplete()
        onOpenChange(false)
        return
      }

      // 로그인된 사용자의 경우 데이터베이스에 저장
      const consentRecords = agreements.map(agreement => ({
        user_id: user.id,
        agreement_id: agreement.id,
        consented: consents[agreement.id] || false,
        ip_address: '', // 클라이언트에서는 IP 주소를 정확히 가져올 수 없음
        user_agent: navigator.userAgent
      }))

      const { error } = await supabase
        .from('user_consents')
        .insert(consentRecords)

      if (error) throw error

      toast.success('동의가 완료되었습니다.')
      onConsentComplete()
      onOpenChange(false)
    } catch (error) {
      console.error('동의 저장 실패:', error)
      toast.error('동의 저장에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            서비스 이용약관 및 개인정보수집동의
          </DialogTitle>
          <DialogDescription>
            GYM29 서비스 이용약관과 개인정보수집동의를 해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 전체 동의 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="allAgree"
                checked={allConsented}
                onCheckedChange={handleAllConsent}
                className="mt-1"
              />
              <label
                htmlFor="allAgree"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                모두 확인하였으며 동의합니다.
              </label>
            </div>
            <p className="text-xs text-gray-600 ml-6">
              전체 동의에는 필수 및 선택 정보에 대한 동의가 포함되어 있으며, 개별적으로 동의를 선택 하실 수 있습니다. 선택 항목에 대한 동의를 거부하시는 경우에도 서비스 이용이 가능합니다.
            </p>
          </div>

          {/* 개별 동의 항목들 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <ScrollArea className="max-h-[40vh] pr-4">
              <div className="space-y-2">
                {agreements.map((agreement) => (
                  <div key={agreement.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`consent-${agreement.id}`}
                        checked={consents[agreement.id] || false}
                        onCheckedChange={(checked) => 
                          handleConsentChange(agreement.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor={`consent-${agreement.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        [{agreement.is_required ? '필수' : '선택'}] {agreement.title}
                      </label>
                    </div>
                    {agreement.has_detail_view && (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                ))}

                {agreements.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>등록된 동의 전문이 없습니다.</p>
                    <p className="text-sm">관리자에게 문의해주세요.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {requiredConsented ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>모든 필수 동의가 완료되었습니다</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span>모든 필수 동의를 완료해주세요</span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              취소
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!requiredConsented || submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  처리 중...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  동의 완료
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
