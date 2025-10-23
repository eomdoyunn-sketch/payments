"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Save, X } from "lucide-react"

type Agreement = {
  type: "service" | "privacy" | "marketing"
  title: string
  version: string
  content: string
  required: boolean
  enabled: boolean
  lastModified: string
}

type AgreementEditorProps = {
  agreement: Agreement
  onSave: (agreement: Agreement) => void
  onClose: () => void
}

export function AgreementEditor({
  agreement,
  onSave,
  onClose
}: AgreementEditorProps) {
  const [editedAgreement, setEditedAgreement] = React.useState<Agreement>(agreement)
  const [saving, setSaving] = React.useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // 동의서 저장 로직
      await new Promise(resolve => setTimeout(resolve, 1000)) // 시뮬레이션
      onSave(editedAgreement)
    } catch (error) {
      console.error('동의서 저장 실패:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof Agreement, value: any) => {
    setEditedAgreement(prev => ({
      ...prev,
      [field]: value
    }))
  }

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline">{getAgreementTypeLabel(editedAgreement.type)}</Badge>
            동의서 편집
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={editedAgreement.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="동의서 제목"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">버전</Label>
              <Input
                id="version"
                value={editedAgreement.version}
                onChange={(e) => handleChange('version', e.target.value)}
                placeholder="v1.0"
              />
            </div>
          </div>

          {/* 설정 */}
          <div className="flex items-center gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={editedAgreement.enabled}
                onCheckedChange={(checked) => handleChange('enabled', checked)}
              />
              <Label htmlFor="enabled">활성화</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={editedAgreement.required}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
              <Label htmlFor="required">필수 동의서</Label>
            </div>
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">동의서 내용</Label>
            <Textarea
              id="content"
              value={editedAgreement.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="동의서 내용을 입력하세요..."
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              취소
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? '저장 중...' : '저장'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

