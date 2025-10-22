"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Building2, Edit, Trash2, Upload } from "lucide-react"
import { CompanyStatus } from "@/components/common/CompanyStatusTable"

type CompanyProductTableProps = {
  companies: CompanyStatus[]
  onEdit?: (company: CompanyStatus) => void
  onDelete?: (id: number | string) => void
  onToggleStatus?: (id: number | string, checked: boolean) => void
  onUploadWhitelist?: (code: string, productType: "fullDay" | "morning" | "evening") => void
}

export function CompanyProductTable({
  companies,
  onEdit,
  onDelete,
  onToggleStatus,
  onUploadWhitelist
}: CompanyProductTableProps) {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          계열사 등록 현황
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium text-sm border-r">계열사명</th>
                <th className="p-3 text-center font-medium text-sm border-r">코드</th>
                <th className="p-3 text-center font-medium text-sm border-r">방식</th>
                <th className="p-3 text-center font-medium text-sm border-r" colSpan={3}>종일권</th>
                <th className="p-3 text-center font-medium text-sm border-r" colSpan={3}>오전권</th>
                <th className="p-3 text-center font-medium text-sm border-r" colSpan={3}>저녁권</th>
                <th className="p-3 text-center font-medium text-sm border-r">활성</th>
                <th className="p-3 text-center font-medium text-sm">액션</th>
              </tr>
              <tr className="border-b bg-muted/50">
                <th className="border-r"></th>
                <th className="border-r"></th>
                <th className="border-r"></th>
                {/* 종일권 */}
                <th className="p-2 text-center font-medium text-xs border-r">배정</th>
                <th className="p-2 text-center font-medium text-xs border-r">등록</th>
                <th className="p-2 text-center font-medium text-xs border-r">명단</th>
                {/* 오전권 */}
                <th className="p-2 text-center font-medium text-xs border-r">배정</th>
                <th className="p-2 text-center font-medium text-xs border-r">등록</th>
                <th className="p-2 text-center font-medium text-xs border-r">명단</th>
                {/* 저녁권 */}
                <th className="p-2 text-center font-medium text-xs border-r">배정</th>
                <th className="p-2 text-center font-medium text-xs border-r">등록</th>
                <th className="p-2 text-center font-medium text-xs border-r">명단</th>
                <th className="border-r"></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-muted/20">
                  {/* 계열사명 */}
                  <td className="p-3 border-r">
                    <div className="font-medium text-sm">{company.name}</div>
                  </td>

                  {/* 코드 */}
                  <td className="p-3 text-center border-r">
                    <Badge variant="outline" className="text-xs">
                      {company.code}
                    </Badge>
                  </td>

                  {/* 방식 */}
                  <td className="p-3 text-center border-r">
                    <Badge 
                      variant={company.mode === "WHL" ? "default" : "secondary"} 
                      className="text-xs"
                    >
                      {company.mode === "WHL" ? "추첨" : "선착"}
                    </Badge>
                  </td>

                  {/* 종일권 - 배정 */}
                  <td className="p-3 text-center border-r">
                    <span className="font-mono text-sm">{company.quota?.fullDay || 0}</span>
                  </td>
                  {/* 종일권 - 등록 */}
                  <td className="p-3 text-center border-r">
                    <span className="font-mono text-sm font-semibold">{company.fullDayPaid || 0}</span>
                  </td>
                  {/* 종일권 - 명단 */}
                  <td className="p-3 text-center border-r">
                    {company.mode === "WHL" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUploadWhitelist?.(company.code, "fullDay")}
                        className="h-7 w-7 p-0"
                      >
                        <Upload className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>

                  {/* 오전권 - 배정 */}
                  <td className="p-3 text-center border-r">
                    <span className="font-mono text-sm">{company.quota?.morning || 0}</span>
                  </td>
                  {/* 오전권 - 등록 */}
                  <td className="p-3 text-center border-r">
                    <span className="font-mono text-sm font-semibold">{company.morningPaid || 0}</span>
                  </td>
                  {/* 오전권 - 명단 */}
                  <td className="p-3 text-center border-r">
                    {company.mode === "WHL" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUploadWhitelist?.(company.code, "morning")}
                        className="h-7 w-7 p-0"
                      >
                        <Upload className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>

                  {/* 저녁권 - 배정 */}
                  <td className="p-3 text-center border-r">
                    <span className="font-mono text-sm">{company.quota?.evening || 0}</span>
                  </td>
                  {/* 저녁권 - 등록 */}
                  <td className="p-3 text-center border-r">
                    <span className="font-mono text-sm font-semibold">{company.eveningPaid || 0}</span>
                  </td>
                  {/* 저녁권 - 명단 */}
                  <td className="p-3 text-center border-r">
                    {company.mode === "WHL" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUploadWhitelist?.(company.code, "evening")}
                        className="h-7 w-7 p-0"
                      >
                        <Upload className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>

                  {/* 활성 토글 */}
                  <td className="p-3 text-center border-r">
                    <div className="flex justify-center">
                      <Switch
                        checked={company.status === "active"}
                        onCheckedChange={(checked) => onToggleStatus?.(company.id, checked)}
                      />
                    </div>
                  </td>

                  {/* 액션 버튼 */}
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(company)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(company.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

