"use client"

import * as React from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Download,
  FileSpreadsheet,
  FileText,
  Database,
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react"

export function ExportClient() {
  const [selectedFormat, setSelectedFormat] = React.useState("excel")
  const [selectedData, setSelectedData] = React.useState<string[]>([])
  const [dateRange, setDateRange] = React.useState({
    start: "",
    end: ""
  })
  const [filters, setFilters] = React.useState({
    company: "",
    status: "",
    processed: ""
  })
  const [exporting, setExporting] = React.useState(false)

  const dataTypes = [
    { id: "payments", label: "결제 내역", description: "모든 결제 데이터" },
    { id: "members", label: "회원 정보", description: "회원 기본 정보" },
    { id: "agreements", label: "동의서 내역", description: "동의서 동의 현황" },
    { id: "statistics", label: "통계 데이터", description: "요약 통계 정보" }
  ]

  const formatOptions = [
    { value: "excel", label: "Excel (.xlsx)", icon: FileSpreadsheet },
    { value: "csv", label: "CSV (.csv)", icon: FileText },
    { value: "json", label: "JSON (.json)", icon: Database }
  ]

  const handleDataSelection = (dataId: string, checked: boolean) => {
    if (checked) {
      setSelectedData(prev => [...prev, dataId])
    } else {
      setSelectedData(prev => prev.filter(id => id !== dataId))
    }
  }

  const handleExport = async () => {
    if (selectedData.length === 0) {
      toast.error("내보낼 데이터를 선택해주세요.")
      return
    }

    setExporting(true)
    try {
      // 각 선택된 데이터 타입에 대해 내보내기
      for (const dataType of selectedData) {
        const params = new URLSearchParams({
          format: selectedFormat,
          type: dataType,
          ...(dateRange.start && { startDate: dateRange.start }),
          ...(dateRange.end && { endDate: dateRange.end }),
          ...(filters.company && { company: filters.company }),
          ...(filters.status && { status: filters.status }),
          ...(filters.processed && { processed: filters.processed })
        })

        const response = await fetch(`/api/export?${params}`)
        
        if (!response.ok) {
          throw new Error('내보내기 실패')
        }

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `gym29-${dataType}-${new Date().toISOString().split('T')[0]}.${selectedFormat === 'excel' ? 'xlsx' : selectedFormat === 'csv' ? 'csv' : 'json'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }

      toast.success("데이터 내보내기가 완료되었습니다.")
    } catch (error) {
      console.error('내보내기 오류:', error)
      toast.error("내보내기에 실패했습니다.")
    } finally {
      setExporting(false)
    }
  }

  const handleSelectAll = () => {
    setSelectedData(dataTypes.map(dt => dt.id))
  }

  const handleSelectNone = () => {
    setSelectedData([])
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader
        title="데이터 내보내기"
        description="다른 프로그램용 데이터 내보내기"
      />

      <Tabs defaultValue="data-selection" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data-selection">데이터 선택</TabsTrigger>
          <TabsTrigger value="filters">필터 설정</TabsTrigger>
          <TabsTrigger value="export">내보내기</TabsTrigger>
        </TabsList>

        {/* 데이터 선택 탭 */}
        <TabsContent value="data-selection" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>내보낼 데이터 선택</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    전체 선택
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSelectNone}>
                    전체 해제
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {dataTypes.map((dataType) => (
                  <div key={dataType.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={dataType.id}
                      checked={selectedData.includes(dataType.id)}
                      onCheckedChange={(checked) => 
                        handleDataSelection(dataType.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor={dataType.id} className="font-medium">
                        {dataType.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {dataType.description}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {dataType.id}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 필터 설정 탭 */}
        <TabsContent value="filters" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>필터 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 날짜 범위 */}
              <div className="space-y-2">
                <Label>날짜 범위</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">시작일</Label>
                    <input
                      id="startDate"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">종료일</Label>
                    <input
                      id="endDate"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* 기타 필터 */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="company">회사</Label>
                  <Select value={filters.company} onValueChange={(value) => setFilters(prev => ({ ...prev, company: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="회사 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      <SelectItem value="삼성전자">삼성전자</SelectItem>
                      <SelectItem value="삼성SDI">삼성SDI</SelectItem>
                      <SelectItem value="삼성E&A">삼성E&A</SelectItem>
                      <SelectItem value="호텔신라">호텔신라</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">결제 상태</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                      <SelectItem value="pending">대기</SelectItem>
                      <SelectItem value="cancelled">취소</SelectItem>
                      <SelectItem value="refunded">환불</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processed">처리 상태</Label>
                  <Select value={filters.processed} onValueChange={(value) => setFilters(prev => ({ ...prev, processed: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="처리 상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">전체</SelectItem>
                      <SelectItem value="true">처리완료</SelectItem>
                      <SelectItem value="false">미처리</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 내보내기 탭 */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>내보내기 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 파일 형식 선택 */}
              <div className="space-y-2">
                <Label>파일 형식</Label>
                <div className="grid gap-3 md:grid-cols-3">
                  {formatOptions.map((format) => {
                    const Icon = format.icon
                    return (
                      <div
                        key={format.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedFormat === format.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedFormat(format.value)}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{format.label}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* 선택된 데이터 요약 */}
              <div className="space-y-2">
                <Label>선택된 데이터</Label>
                <div className="p-4 bg-muted rounded-lg">
                  {selectedData.length === 0 ? (
                    <p className="text-muted-foreground">선택된 데이터가 없습니다.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedData.map((dataId) => {
                        const dataType = dataTypes.find(dt => dt.id === dataId)
                        return (
                          <div key={dataId} className="flex items-center justify-between">
                            <span className="font-medium">{dataType?.label}</span>
                            <Badge variant="outline">{dataType?.id}</Badge>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 내보내기 버튼 */}
              <div className="flex justify-center">
                <Button
                  onClick={handleExport}
                  disabled={exporting || selectedData.length === 0}
                  size="lg"
                  className="min-w-48"
                >
                  {exporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      내보내는 중...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      데이터 내보내기
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

