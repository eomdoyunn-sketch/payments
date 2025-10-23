"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react"
import {
  WhitelistEntry,
  parsePastedData,
  removeDuplicates,
  exportToCSV,
  validateQuantity
} from "@/lib/whitelist-utils"
import { uploadWhitelist, getWhitelist } from "@/app/actions/whitelists"
import { toast } from "sonner"

type WhitelistManagementModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  companyCode: string
  companyName: string
  productType: "fullDay" | "morning" | "evening"
  allocatedTotal: number
}

export function WhitelistManagementModal({
  open,
  onOpenChange,
  companyCode,
  companyName,
  productType,
  allocatedTotal
}: WhitelistManagementModalProps) {
  const [pasteText, setPasteText] = React.useState("")
  const [entries, setEntries] = React.useState<WhitelistEntry[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const productTypeLabel = productType === "fullDay" ? "종일권" : productType === "morning" ? "오전권" : "저녁권"

  // 모달 열릴 때 Supabase에서 기존 명단 불러오기
  React.useEffect(() => {
    if (open) {
      const fetchWhitelist = async () => {
        setIsLoading(true)
        try {
          const data = await getWhitelist(companyCode, productType)
          // Supabase 데이터를 WhitelistEntry 형식으로 변환
          const entries: WhitelistEntry[] = data.map((item: any) => ({
            id: item.id,
            companyCode: item.company_code,
            companyName: companyName,
            name: item.name,
            productType: item.product_type,
            createdAt: item.created_at
          }))
          setEntries(entries)
          setPasteText("")
        } catch (error) {
          console.error('명단 불러오기 실패:', error)
          toast.error('명단을 불러오는데 실패했습니다.')
          setEntries([])
        } finally {
          setIsLoading(false)
        }
      }
      fetchWhitelist()
    }
  }, [open, companyCode, productType, companyName])

  // 붙여넣기 처리
  const handlePaste = () => {
    if (!pasteText.trim()) {
      toast.error("명단 데이터를 입력해주세요")
      return
    }

    try {
      // parsePastedData 함수 사용 (회원권 종류 포함)
      const parsed = parsePastedData(pasteText, companyCode, companyName, productType)
      
      if (parsed.length === 0) {
        toast.error("이름을 입력해주세요.")
        return
      }

      // 기존 항목과 병합 후 중복 제거
      const merged = [...entries, ...parsed]
      const unique = removeDuplicates(merged)

      setEntries(unique)
      setPasteText("")
      toast.success(`${parsed.length}명이 추가되었습니다 (중복 제거 후: ${unique.length}명)`)
    } catch (error) {
      console.error(error)
      toast.error("데이터 파싱 중 오류가 발생했습니다")
    }
  }

  // 개별 항목 삭제
  const handleDelete = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
    toast.success("삭제되었습니다")
  }

  // 전체 삭제
  const handleClearAll = () => {
    if (confirm("모든 명단을 삭제하시겠습니까?")) {
      setEntries([])
      toast.success("모든 명단이 삭제되었습니다")
    }
  }

  // 저장 (Supabase에 업로드)
  const handleSave = async () => {
    // 수량 검증
    const validation = validateQuantity(entries, allocatedTotal)
    if (!validation.valid) {
      toast.error(validation.message)
      return
    }

    setIsLoading(true)
    try {
      // 이름 배열만 추출
      const names = entries.map(entry => entry.name)
      
      // Supabase에 업로드
      const result = await uploadWhitelist(companyCode, productType, names)
      
      toast.success(`${productTypeLabel} 명단이 저장되었습니다!`, {
        description: `${result.count}명의 추첨 명단이 등록되었습니다.`
      })
      onOpenChange(false)
    } catch (error: any) {
      console.error('저장 실패:', error)
      const errorMessage = error?.message || "저장 중 오류가 발생했습니다"
      toast.error(`저장 실패: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  // CSV 내보내기
  const handleExport = () => {
    if (entries.length === 0) {
      toast.error("내보낼 명단이 없습니다")
      return
    }

    const csv = exportToCSV(entries)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `whitelist_${companyCode}_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    toast.success("CSV 파일이 다운로드되었습니다")
  }

  // 수량 검증 상태
  const validation = validateQuantity(entries, allocatedTotal)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {productTypeLabel} 명단 관리 - {companyName} ({companyCode})
          </DialogTitle>
          <DialogDescription>
            {companyName} {productTypeLabel} 명단을 관리하세요. 이름만 입력하면 자동으로 등록됩니다.
            <br />
            <strong>형식</strong>: 이름만 입력 (한 줄에 하나씩)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 수량 검증 알림 */}
          <Alert variant={validation.valid ? "default" : "destructive"}>
            {validation.valid ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>{validation.message}</span>
                <Badge variant={validation.valid ? "outline" : "destructive"}>
                  {entries.length} / {allocatedTotal}명
                </Badge>
              </div>
            </AlertDescription>
          </Alert>

          {/* 붙여넣기 영역 */}
          <div className="space-y-2">
            <Label htmlFor="paste">엑셀 데이터 붙여넣기</Label>
            <Textarea
              id="paste"
              placeholder={`이름을 한 줄에 하나씩 입력하세요\n\n예시:\n김철수\n이영희\n박민수`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handlePaste} disabled={!pasteText.trim()} size="sm">
                명단 추가
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={entries.length === 0} size="sm">
                <Download className="mr-2 h-4 w-4" />
                CSV 내보내기
              </Button>
            </div>
          </div>

          {/* 명단 테이블 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>등록된 명단 ({entries.length}명)</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={entries.length === 0}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                전체 삭제
              </Button>
            </div>

            {entries.length > 0 ? (
              <div className="rounded-md border max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-muted/50 border-b">
                    <tr>
                      <th className="p-2 text-left text-sm font-medium w-[50px]">No</th>
                      <th className="p-2 text-left text-sm font-medium">계열사명</th>
                      <th className="p-2 text-left text-sm font-medium">이름</th>
                      <th className="p-2 text-center text-sm font-medium w-[80px]">삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, index) => (
                      <tr key={entry.id} className="border-b hover:bg-muted/30">
                        <td className="p-2 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="p-2 text-sm font-medium text-blue-600">{entry.companyName}</td>
                        <td className="p-2 text-sm font-medium">{entry.name}</td>
                        <td className="p-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                            className="h-7 px-2"
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border rounded-md">
                등록된 명단이 없습니다. 위에서 명단을 추가해주세요.
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
            취소
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !validation.valid} size="sm">
            {isLoading ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

