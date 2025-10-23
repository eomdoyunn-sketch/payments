"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Save, X } from "lucide-react"

type CompanyAgreementSettings = {
  companyId: string
  companyName: string
  agreements: {
    service: { enabled: boolean; required: boolean }
    privacy: { enabled: boolean; required: boolean }
    marketing: { enabled: boolean; required: boolean }
  }
}

type AgreementSettingsProps = {
  settings: CompanyAgreementSettings
  onSave: (settings: CompanyAgreementSettings) => void
  onClose: () => void
}

export function AgreementSettings({
  settings,
  onSave,
  onClose
}: AgreementSettingsProps) {
  const [editedSettings, setEditedSettings] = React.useState<CompanyAgreementSettings>(settings)
  const [saving, setSaving] = React.useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // 설정 저장 로직
      await new Promise(resolve => setTimeout(resolve, 1000)) // 시뮬레이션
      onSave(editedSettings)
    } catch (error) {
      console.error('설정 저장 실패:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAgreementChange = (
    agreementType: keyof typeof editedSettings.agreements,
    field: 'enabled' | 'required',
    value: boolean
  ) => {
    setEditedSettings(prev => ({
      ...prev,
      agreements: {
        ...prev.agreements,
        [agreementType]: {
          ...prev.agreements[agreementType],
          [field]: value
        }
      }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{editedSettings.companyName} 동의서 설정</h2>
        <div className="flex gap-2">
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

      <div className="grid gap-4">
        {Object.entries(editedSettings.agreements).map(([type, config]) => (
          <Card key={type}>
            <CardHeader>
              <div className="flex items-center gap-2">
                {getAgreementTypeBadge(type)}
                <CardTitle className="text-base">
                  {getAgreementTypeLabel(type)}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor={`${type}-enabled`}>활성화</Label>
                    <p className="text-sm text-muted-foreground">
                      이 동의서를 회원가입 시 표시합니다.
                    </p>
                  </div>
                  <Switch
                    id={`${type}-enabled`}
                    checked={config.enabled}
                    onCheckedChange={(checked) => 
                      handleAgreementChange(type as keyof typeof editedSettings.agreements, 'enabled', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor={`${type}-required`}>필수 동의</Label>
                    <p className="text-sm text-muted-foreground">
                      이 동의서를 필수로 동의해야 회원가입이 가능합니다.
                    </p>
                  </div>
                  <Switch
                    id={`${type}-required`}
                    checked={config.required}
                    onCheckedChange={(checked) => 
                      handleAgreementChange(type as keyof typeof editedSettings.agreements, 'required', checked)
                    }
                    disabled={!config.enabled}
                  />
                </div>

                {config.enabled && (
                  <div className="p-3 bg-muted rounded-md">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">현재 설정:</span>
                        <Badge variant={config.required ? "destructive" : "outline"}>
                          {config.required ? "필수" : "선택"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {config.required 
                          ? "회원가입 시 이 동의서에 반드시 동의해야 합니다."
                          : "회원가입 시 이 동의서는 선택사항입니다."
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

