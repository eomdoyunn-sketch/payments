"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Building2, Edit, Trash2, FileUp } from "lucide-react"

export type CompanyStatus = {
  id: string | number
  name: string
  code: string
  quota?: {
    fullDay?: number
    morning?: number
    evening?: number
  }
  mode: "FCFS" | "WHL"
  status: "active" | "inactive"
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

type CompanyStatusTableProps = {
  companies: CompanyStatus[]
  onEdit?: (company: CompanyStatus) => void
  onDelete?: (id: number | string) => void
  onToggleStatus?: (id: number | string, checked: boolean) => void
  onUploadWhitelist?: (code: string) => void
  onCompanyClick?: (company: CompanyStatus) => void
  showActions?: boolean
  showExtendedInfo?: boolean
  getRegistrationStatus?: (company: CompanyStatus) => string
  getStatusLabel?: (status: string) => string
  getStatusVariant?: (status: string) => "default" | "secondary" | "destructive" | "outline"
  getEligibility?: (company: CompanyStatus) => { canPay: boolean; reason: string }
}

export function CompanyStatusTable({
  companies,
  onEdit,
  onDelete,
  onToggleStatus,
  onUploadWhitelist,
  onCompanyClick,
  showActions = false,
  showExtendedInfo = false,
  getRegistrationStatus,
  getStatusLabel,
  getStatusVariant,
  getEligibility
}: CompanyStatusTableProps) {
  // 통계 계산
  const totalAllocated = companies.reduce((sum, company) => sum + (company.allocatedTotal || 0), 0)
  const totalFullDayAllocated = companies.reduce((sum, company) => sum + (company.fullDayAllocated || 0), 0)
  const totalFullDayPaid = companies.reduce((sum, company) => sum + (company.fullDayPaid || 0), 0)
  const totalMorningAllocated = companies.reduce((sum, company) => sum + (company.morningAllocated || 0), 0)
  const totalMorningPaid = companies.reduce((sum, company) => sum + (company.morningPaid || 0), 0)
  const totalEveningAllocated = companies.reduce((sum, company) => sum + (company.eveningAllocated || 0), 0)
  const totalEveningPaid = companies.reduce((sum, company) => sum + (company.eveningPaid || 0), 0)
  const totalPaid = totalFullDayPaid + totalMorningPaid + totalEveningPaid

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          계열사 등록현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium text-sm">계열사명</th>
                <th className="p-3 text-center font-medium text-sm w-[80px]">코드</th>
                <th className="p-3 text-center font-medium text-sm w-[80px]">방식</th>
                <th className="p-3 text-center font-medium text-sm w-[100px]">상태</th>
                <th className="p-3 text-center font-medium text-sm w-[80px]">배분<br/>합계</th>
                <th className="p-3 text-center font-medium text-sm w-[80px]">종일<br/>등록</th>
                <th className="p-3 text-center font-medium text-sm w-[80px]">오전<br/>등록</th>
                <th className="p-3 text-center font-medium text-sm w-[80px]">저녁<br/>등록</th>
                <th className="p-3 text-center font-medium text-sm w-[80px]">소계</th>
                <th className="p-3 text-center font-medium text-sm w-[100px]">활성</th>
                {showActions && (
                  <th className="p-3 text-center font-medium text-sm w-[120px]">액션</th>
                )}
              </tr>
            </thead>
            <tbody>
              {companies.map((company, index) => {
                const subtotal = (company.fullDayPaid || 0) + (company.morningPaid || 0) + (company.eveningPaid || 0)
                const registrationStatus = getRegistrationStatus?.(company) || 'unknown'
                const eligibility = getEligibility?.(company) || { canPay: false, reason: '' }
                const statusVariant = getStatusVariant?.(registrationStatus) || 'default'
                const statusLabel = getStatusLabel?.(registrationStatus) || registrationStatus

                return (
                  <tr
                    key={company.id}
                    className={`border-b hover:bg-muted/30 transition-colors ${
                      company.status === "inactive" ? "opacity-60" : ""
                    } ${onCompanyClick ? "cursor-pointer" : ""}`}
                    onClick={() => onCompanyClick?.(company)}
                  >
                    {/* 계열사명 */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">{company.name}</span>
                      </div>
                    </td>

                    {/* 코드 */}
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="text-xs">
                        {company.code}
                      </Badge>
                    </td>

                    {/* 방식 */}
                    <td className="p-3 text-center">
                      <Badge variant={company.mode === "FCFS" ? "default" : "secondary"} className="text-xs">
                        {company.mode === "FCFS" ? "선착순" : "추첨"}
                      </Badge>
                    </td>

                    {/* 상태 */}
                    <td className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge variant={statusVariant} className="text-xs">
                          {statusLabel}
                        </Badge>
                        {eligibility.reason && (
                          <span className="text-xs text-muted-foreground">
                            {eligibility.reason}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 배분합계 */}
                    <td className="p-3 text-center font-medium">
                      {company.allocatedTotal || 0}
                    </td>

                    {/* 종일 등록 */}
                    <td className="p-3 text-center">
                      <div className="text-sm">
                        <span className="font-semibold">{company.fullDayPaid || 0}</span>
                        <span className="text-muted-foreground">/{company.fullDayAllocated || 0}</span>
                      </div>
                    </td>

                    {/* 오전 등록 */}
                    <td className="p-3 text-center">
                      <div className="text-sm">
                        <span className="font-semibold">{company.morningPaid || 0}</span>
                        <span className="text-muted-foreground">/{company.morningAllocated || 0}</span>
                      </div>
                    </td>

                    {/* 저녁 등록 */}
                    <td className="p-3 text-center">
                      <div className="text-sm">
                        <span className="font-semibold">{company.eveningPaid || 0}</span>
                        <span className="text-muted-foreground">/{company.eveningAllocated || 0}</span>
                      </div>
                    </td>

                    {/* 소계 */}
                    <td className="p-3 text-center">
                      <span className="font-bold text-primary">{subtotal}</span>
                    </td>

                    {/* 활성/비활성 토글 */}
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {company.mode === "WHL" && onUploadWhitelist && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onUploadWhitelist(company.code)
                            }}
                            className="h-7 px-2 text-xs"
                          >
                            <FileUp className="h-3 w-3" />
                          </Button>
                        )}
                        {onToggleStatus && (
                          <Switch
                            checked={company.status === "active"}
                            onCheckedChange={(checked) => {
                              onToggleStatus(company.id, checked)
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    </td>

                    {/* 액션 버튼 */}
                    {showActions && (
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          {onEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onEdit(company)
                              }}
                              className="h-7 px-2"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDelete(company.id)
                              }}
                              className="h-7 px-2 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}

              {/* 합계 행 */}
              <tr className="bg-muted/50 font-medium">
                <td className="p-3 text-left">합계</td>
                <td className="p-3 text-center">-</td>
                <td className="p-3 text-center">-</td>
                <td className="p-3 text-center">-</td>
                <td className="p-3 text-center font-bold">{totalAllocated}</td>
                <td className="p-3 text-center">
                  <div className="text-sm">
                    <span className="font-semibold">{totalFullDayPaid}</span>
                    <span className="text-muted-foreground">/{totalFullDayAllocated}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="text-sm">
                    <span className="font-semibold">{totalMorningPaid}</span>
                    <span className="text-muted-foreground">/{totalMorningAllocated}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <div className="text-sm">
                    <span className="font-semibold">{totalEveningPaid}</span>
                    <span className="text-muted-foreground">/{totalEveningAllocated}</span>
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span className="font-bold text-primary text-lg">{totalPaid}</span>
                </td>
                <td className="p-3 text-center">-</td>
                {showActions && <td className="p-3 text-center">-</td>}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// 계열사 상태 카드 컴포넌트
export function CompanyStatusCard({ company }: { company: CompanyStatus }) {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4" />
            <span className="font-semibold">{company.name}</span>
            <Badge variant="outline">{company.code}</Badge>
          </div>
          <div className="flex gap-2 text-sm text-muted-foreground">
            <span>할당: {company.allocatedTotal}명</span>
            <span>등록: {company.registered}명</span>
            <span>잔여: {company.remaining}명</span>
          </div>
        </div>
        <Badge variant={company.mode === "FCFS" ? "default" : "secondary"}>
          {company.mode === "FCFS" ? "선착순" : "추첨"}
        </Badge>
      </div>
    </div>
  )
}
