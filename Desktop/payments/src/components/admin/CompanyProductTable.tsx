"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Building2, Edit, Trash2, Upload, Plus } from "lucide-react"
import { CompanyStatus } from "@/components/common/CompanyStatusTable"
import { getWhitelistStatus } from "@/app/actions/whitelists"

type CompanyProductTableProps = {
  companies: CompanyStatus[]
  onEdit?: (company: CompanyStatus) => void
  onDelete?: (id: number | string) => void
  onToggleStatus?: (id: number | string, checked: boolean) => void
  onUploadWhitelist?: (code: string, productType: "fullDay" | "morning" | "evening") => void
  onAddCompany?: () => void
}

// 최적화된 회사 행 컴포넌트
const CompanyRow = React.memo(({ 
  company, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onUploadWhitelist 
}: {
  company: CompanyStatus
  onEdit?: (company: CompanyStatus) => void
  onDelete?: (id: number | string) => void
  onToggleStatus?: (id: number | string, checked: boolean) => void
  onUploadWhitelist?: (code: string, productType: "fullDay" | "morning" | "evening") => void
}) => {
  const [whitelistStatus, setWhitelistStatus] = React.useState<{
    fullDay: { hasWhitelist: boolean; count: number; isOverLimit: boolean; allocatedQuota: number }
    morning: { hasWhitelist: boolean; count: number; isOverLimit: boolean; allocatedQuota: number }
    evening: { hasWhitelist: boolean; count: number; isOverLimit: boolean; allocatedQuota: number }
  }>({
    fullDay: { hasWhitelist: false, count: 0, isOverLimit: false, allocatedQuota: 0 },
    morning: { hasWhitelist: false, count: 0, isOverLimit: false, allocatedQuota: 0 },
    evening: { hasWhitelist: false, count: 0, isOverLimit: false, allocatedQuota: 0 }
  })

  // whitelist 상태 조회
  React.useEffect(() => {
    const fetchWhitelistStatus = async () => {
      if (company.mode !== "WHL") return

      try {
        const [fullDayStatus, morningStatus, eveningStatus] = await Promise.all([
          getWhitelistStatus(company.code, "fullDay"),
          getWhitelistStatus(company.code, "morning"),
          getWhitelistStatus(company.code, "evening")
        ])

        setWhitelistStatus({
          fullDay: fullDayStatus,
          morning: morningStatus,
          evening: eveningStatus
        })
      } catch (error) {
        console.error('Error fetching whitelist status:', error)
      }
    }

    fetchWhitelistStatus()
  }, [company.code, company.mode])

  const handleToggle = React.useCallback((checked: boolean) => {
    onToggleStatus?.(company.id, checked)
  }, [company.id, onToggleStatus])

  const handleEdit = React.useCallback(() => {
    onEdit?.(company)
  }, [company, onEdit])

  const handleDelete = React.useCallback(() => {
    onDelete?.(company.id)
  }, [company.id, onDelete])

  const handleUploadWhitelist = React.useCallback((productType: "fullDay" | "morning" | "evening") => {
    onUploadWhitelist?.(company.code, productType)
  }, [company.code, onUploadWhitelist])

  // 업로드 후 상태 새로고침을 위한 함수
  const refreshWhitelistStatus = React.useCallback(async () => {
    if (company.mode !== "WHL") return

    try {
      const [fullDayStatus, morningStatus, eveningStatus] = await Promise.all([
        getWhitelistStatus(company.code, "fullDay"),
        getWhitelistStatus(company.code, "morning"),
        getWhitelistStatus(company.code, "evening")
      ])

      setWhitelistStatus({
        fullDay: fullDayStatus,
        morning: morningStatus,
        evening: eveningStatus
      })
    } catch (error) {
      console.error('Error refreshing whitelist status:', error)
    }
  }, [company.code, company.mode])

  // 컴포넌트가 마운트될 때와 업로드 후 상태 새로고침
  React.useEffect(() => {
    const fetchWhitelistStatus = async () => {
      if (company.mode !== "WHL") return

      try {
        const [fullDayStatus, morningStatus, eveningStatus] = await Promise.all([
          getWhitelistStatus(company.code, "fullDay"),
          getWhitelistStatus(company.code, "morning"),
          getWhitelistStatus(company.code, "evening")
        ])

        setWhitelistStatus({
          fullDay: fullDayStatus,
          morning: morningStatus,
          evening: eveningStatus
        })
      } catch (error) {
        console.error('Error fetching whitelist status:', error)
      }
    }

    fetchWhitelistStatus()
  }, [company.code, company.mode])

  // 업로드 후 상태 새로고침을 위한 이벤트 리스너
  React.useEffect(() => {
    const handleWhitelistUpdate = () => {
      refreshWhitelistStatus()
    }

    // 커스텀 이벤트 리스너 등록
    window.addEventListener('whitelist-updated', handleWhitelistUpdate)
    
    return () => {
      window.removeEventListener('whitelist-updated', handleWhitelistUpdate)
    }
  }, [refreshWhitelistStatus])

  // 업로드 버튼 스타일 및 아이콘 결정
  const getUploadButtonProps = (productType: "fullDay" | "morning" | "evening") => {
    const status = whitelistStatus[productType]
    
    if (status.isOverLimit) {
      return {
        icon: <Upload className="h-3.5 w-3.5" />,
        className: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
        tooltip: `명단 초과! ${status.count}명 업로드됨 (배분: ${status.allocatedQuota}명)`
      }
    } else if (status.hasWhitelist) {
      return {
        icon: <Upload className="h-3.5 w-3.5" />,
        className: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
        tooltip: `명단 업로드됨 (${status.count}명)`
      }
    } else {
      return {
        icon: <Upload className="h-3.5 w-3.5" />,
        className: "hover:bg-muted",
        tooltip: "명단을 업로드하려면 클릭하세요"
      }
    }
  }

  return (
    <tr className="border-b hover:bg-muted/20">
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUploadWhitelist("fullDay")}
                className={`h-7 w-7 p-0 ${getUploadButtonProps("fullDay").className}`}
              >
                {getUploadButtonProps("fullDay").icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getUploadButtonProps("fullDay").tooltip}</p>
            </TooltipContent>
          </Tooltip>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUploadWhitelist("morning")}
                className={`h-7 w-7 p-0 ${getUploadButtonProps("morning").className}`}
              >
                {getUploadButtonProps("morning").icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getUploadButtonProps("morning").tooltip}</p>
            </TooltipContent>
          </Tooltip>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUploadWhitelist("evening")}
                className={`h-7 w-7 p-0 ${getUploadButtonProps("evening").className}`}
              >
                {getUploadButtonProps("evening").icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getUploadButtonProps("evening").tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </td>

      {/* 활성 토글 */}
      <td className="p-3 text-center border-r">
        <div className="flex justify-center">
          <Switch
            checked={company.status === "active"}
            onCheckedChange={handleToggle}
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
              onClick={handleEdit}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
})

CompanyRow.displayName = 'CompanyRow'

export function CompanyProductTable({
  companies,
  onEdit,
  onDelete,
  onToggleStatus,
  onUploadWhitelist,
  onAddCompany
}: CompanyProductTableProps) {
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            계열사 등록 현황
          </CardTitle>
          {onAddCompany && (
            <Button onClick={onAddCompany} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              계열사 추가
            </Button>
          )}
        </div>
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
                <CompanyRow
                  key={company.id}
                  company={company}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleStatus={onToggleStatus}
                  onUploadWhitelist={onUploadWhitelist}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

