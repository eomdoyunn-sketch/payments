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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { FileText, Save, RotateCcw } from "lucide-react"
import { Agreement } from "./AgreementModal"

type AgreementEditorProps = {
  agreement: Agreement | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (agreement: Agreement) => void
}

export function AgreementEditor({
  agreement,
  open,
  onOpenChange,
  onSave
}: AgreementEditorProps) {
  const [editedAgreement, setEditedAgreement] = React.useState<Agreement | null>(null)
  const [hasChanges, setHasChanges] = React.useState(false)

  // 모달이 열릴 때마다 초기화
  React.useEffect(() => {
    if (agreement) {
      setEditedAgreement({ ...agreement })
      setHasChanges(false)
    }
  }, [agreement, open])

  const handleSave = () => {
    if (editedAgreement) {
      onSave(editedAgreement)
      setHasChanges(false)
      onOpenChange(false)
    }
  }

  const handleReset = () => {
    if (agreement) {
      setEditedAgreement({ ...agreement })
      setHasChanges(false)
    }
  }

  const handleChange = (field: keyof Agreement, value: any) => {
    if (editedAgreement) {
      setEditedAgreement(prev => ({
        ...prev!,
        [field]: value
      }))
      setHasChanges(true)
    }
  }

  const handleContentChange = (value: string) => {
    handleChange('content', value)
  }

  if (!editedAgreement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            동의서 편집
          </DialogTitle>
          <DialogDescription>
            {editedAgreement.title}의 내용을 편집할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={editedAgreement.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="동의서 제목을 입력하세요"
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
            
            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={editedAgreement.required}
                onCheckedChange={(checked) => handleChange('required', checked)}
              />
              <Label htmlFor="required">필수 동의서</Label>
              <Badge variant={editedAgreement.required ? "default" : "secondary"}>
                {editedAgreement.required ? "필수" : "선택"}
              </Badge>
            </div>
          </div>

          {/* 동의서 내용 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">동의서 내용</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={!hasChanges}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  초기화
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={editedAgreement.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="동의서 내용을 입력하세요..."
                className="min-h-[400px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                💡 줄바꿈은 자동으로 처리됩니다. 제목은 **굵게**, 목록은 - 또는 숫자로 작성하세요.
              </p>
            </div>
          </div>

          {/* 미리보기 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">미리보기</h3>
            <div className="border rounded-lg p-4 bg-muted/20 max-h-[300px] overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {editedAgreement.content}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="min-w-[100px]"
          >
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 동의서 목록 편집 컴포넌트
type AgreementListEditorProps = {
  agreements: Agreement[]
  onAgreementEdit: (agreement: Agreement) => void
  onAgreementAdd: () => void
  onAgreementDelete: (type: string) => void
  onAgreementView?: (agreement: Agreement) => void
  agreementEnabled?: Record<string, boolean>
  onAgreementToggle?: (type: string, enabled: boolean) => void
}

export function AgreementListEditor({
  agreements,
  onAgreementEdit,
  onAgreementAdd,
  onAgreementDelete,
  onAgreementView,
  agreementEnabled,
  onAgreementToggle
}: AgreementListEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">동의서 목록</h3>
        <Button onClick={onAgreementAdd} size="sm">
          <FileText className="h-4 w-4 mr-1" />
          동의서 추가
        </Button>
      </div>
      
      <div className="space-y-3">
        {agreements.map((agreement) => (
          <div key={agreement.type} className="flex items-center justify-between p-4 border rounded-lg">
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
              {onAgreementView && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAgreementView(agreement)}
                >
                  미리보기
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAgreementEdit(agreement)}
              >
                편집
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAgreementDelete(agreement.type)}
                className="text-destructive hover:text-destructive"
              >
                삭제
              </Button>
              {onAgreementToggle && agreementEnabled && (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l">
                  <Switch
                    checked={agreementEnabled[agreement.type] || false}
                    onCheckedChange={(checked) => onAgreementToggle(agreement.type, checked)}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
