"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

type Company = {
  id: string | number
  name: string
  code?: string
  quota?: {
    fullDay?: number
    morning?: number
    evening?: number
  }
  mode: "FCFS" | "WHL" | string
  isActive?: boolean
  status?: string
  registered?: number
  remaining?: number
  contactPerson?: string
  contactEmail?: string
  contactPhone?: string
  allocatedTotal?: number
  fullDayAllocated?: number
  fullDayPaid?: number
  morningAllocated?: number
  morningPaid?: number
  eveningAllocated?: number
  eveningPaid?: number
}

type CompanyFormProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  mode?: "create" | "edit"
  company?: Company
  onSave: (data: Partial<Company>) => void
  onCancel?: () => void
  registrationPeriod?: {
    startDate: string
    endDate: string
  }
}

type CompanyFormComponentProps = CompanyFormProps & {
  onCancel?: () => void
}

export function CompanyForm({
  open,
  onOpenChange,
  mode,
  company,
  onSave,
  onCancel,
  registrationPeriod = {
    startDate: "2025-10-07",
    endDate: "2025-10-11"
  }
}: CompanyFormComponentProps) {
  const [formData, setFormData] = React.useState<Company>({
    id: "",
    name: "",
    code: "",
    quota: { fullDay: 0, morning: 0, evening: 0 },
    mode: "FCFS",
    isActive: true,
    status: "active",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  })

  React.useEffect(() => {
    if (company) {
      setFormData(company)
    }
  }, [company])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  const totalQuota =
    (formData.quota?.fullDay || 0) + (formData.quota?.morning || 0) + (formData.quota?.evening || 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "계열사 추가" : "계열사 수정"}
          </DialogTitle>
          <DialogDescription>
            계열사 정보를 입력해주세요
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* 계열사 코드 */}
            <div className="space-y-2">
              <Label htmlFor="code">계열사 코드</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder={mode === "create" ? "자동 생성됩니다" : formData.code}
                disabled={true}
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                {mode === "create" 
                  ? "💡 계열사 코드는 자동으로 생성됩니다 (H01, H02, H03...)" 
                  : "💡 계열사 코드는 수정할 수 없습니다"}
              </p>
            </div>

            {/* 계열사명 */}
            <div className="space-y-2">
              <Label htmlFor="name">계열사명</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="예: 한화건설"
                required
              />
            </div>

            {/* 담당자 정보 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="contactPerson">담당자</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  placeholder="홍길동"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">이메일</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  placeholder="example@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">연락처</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPhone: e.target.value })
                  }
                  placeholder="02-1234-5678"
                />
              </div>
            </div>

            <Separator />

            {/* 할당량 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">할당량</Label>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="fullDay">종일권</Label>
                  <Input
                    id="fullDay"
                    type="number"
                    min="0"
                    value={formData.quota?.fullDay || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quota: {
                          ...formData.quota,
                          fullDay: parseInt(e.target.value) || 0
                        }
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="morning">오전권</Label>
                  <Input
                    id="morning"
                    type="number"
                    min="0"
                    value={formData.quota?.morning || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quota: {
                          ...formData.quota,
                          morning: parseInt(e.target.value) || 0
                        }
                      })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evening">저녁권</Label>
                  <Input
                    id="evening"
                    type="number"
                    min="0"
                    value={formData.quota?.evening || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quota: {
                          ...formData.quota,
                          evening: parseInt(e.target.value) || 0
                        }
                      })
                    }
                    required
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                합계: {totalQuota}명
              </p>
            </div>

            <Separator />

            {/* 등록 모드 */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">등록 모드</Label>
              <RadioGroup
                value={formData.mode}
                onValueChange={(value) =>
                  setFormData({ ...formData, mode: value as "FCFS" | "WHL" })
                }
                className="flex flex-row gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FCFS" id="fcfs" />
                  <Label htmlFor="fcfs" className="font-normal cursor-pointer">
                    선착순
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="WHL" id="whl" />
                  <Label htmlFor="whl" className="font-normal cursor-pointer">
                    추첨제
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* 상태 */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">상태</Label>
                <p className="text-sm text-muted-foreground">
                  비활성화 시 해당 계열사의 결제가 차단됩니다
                </p>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (onOpenChange) {
                  onOpenChange(false)
                }
                if (onCancel) {
                  onCancel()
                }
              }}
            >
              취소
            </Button>
            <Button type="submit" size="sm">저장</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
