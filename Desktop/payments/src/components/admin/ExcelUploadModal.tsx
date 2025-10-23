"use client"

import * as React from "react"
import * as XLSX from "xlsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, CheckCircle, XCircle, FileSpreadsheet, Download } from "lucide-react"

type ExcelMember = {
  사번: string
  이름: string
  이메일?: string
  연락처?: string
  부서?: string
}

type ExcelUploadModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (members: ExcelMember[]) => void
}

export function ExcelUploadModal({
  open,
  onOpenChange,
  onUpload
}: ExcelUploadModalProps) {
  const [members, setMembers] = React.useState<ExcelMember[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = event.target?.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<ExcelMember>(worksheet)

        // 필수 컬럼 검증
        const requiredColumns = ['사번', '이름']
        const hasRequiredColumns = requiredColumns.every(col => 
          jsonData.length > 0 && jsonData[0].hasOwnProperty(col)
        )

        if (!hasRequiredColumns) {
          alert("엑셀 파일에 '사번', '이름' 컬럼이 필요합니다.")
          setIsUploading(false)
          return
        }

        setMembers(jsonData)
        onUpload(jsonData)
      } catch (error) {
        console.error("엑셀 파일 읽기 오류:", error)
        alert("엑셀 파일을 읽는 중 오류가 발생했습니다.")
      } finally {
        setIsUploading(false)
      }
    }

    reader.readAsBinaryString(file)
  }

  // 파일 선택 버튼 클릭
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  // 모달 닫기 시 초기화
  const handleClose = () => {
    setMembers([])
    onOpenChange(false)
  }

  // 엑셀 템플릿 다운로드
  const downloadTemplate = () => {
    const templateData = [
      { 사번: "EMP001", 이름: "홍길동", 이메일: "hong@company.com", 연락처: "010-1234-5678", 부서: "개발팀" },
      { 사번: "EMP002", 이름: "김철수", 이메일: "kim@company.com", 연락처: "010-2345-6789", 부서: "마케팅팀" }
    ]
    
    const ws = XLSX.utils.json_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "명단")
    XLSX.writeFile(wb, "명단_템플릿.xlsx")
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            명단 업로드
          </DialogTitle>
          <DialogDescription>
            회사 직원 명단을 엑셀 파일로 업로드하여 결제 여부를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 파일 업로드 영역 */}
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 bg-muted/20">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                엑셀 파일(.xlsx, .xls)을 업로드하세요
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button onClick={handleButtonClick} disabled={isUploading}>
                  {isUploading ? "업로드 중..." : "파일 선택"}
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  템플릿 다운로드
                </Button>
              </div>
            </div>

            {/* 업로드 안내 */}
            <Alert>
              <AlertDescription className="text-sm">
                <strong>엑셀 파일 형식:</strong> 첫 번째 행은 헤더(사번, 이름, 이메일, 연락처, 부서)이고, 
                두 번째 행부터 데이터가 있어야 합니다. 최소 '사번', '이름' 컬럼은 필수입니다.
              </AlertDescription>
            </Alert>
          </div>

          {/* 업로드된 명단 테이블 */}
          {members.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">업로드된 명단 ({members.length}명)</h3>
                <Button variant="outline" size="sm" onClick={handleClose}>
                  확인
                </Button>
              </div>
              <div className="border border-border rounded-md overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">번호</th>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">사번</th>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">이름</th>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">이메일</th>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">연락처</th>
                        <th className="text-center text-foreground px-3 py-2">부서</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member, index) => (
                        <tr 
                          key={index}
                          className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}
                        >
                          <td className="border-r border-border/30 px-3 py-2 text-center text-sm">
                            {index + 1}
                          </td>
                          <td className="border-r border-border/30 px-3 py-2 text-center text-sm">
                            {member.사번}
                          </td>
                          <td className="border-r border-border/30 px-3 py-2 text-center">
                            {member.이름}
                          </td>
                          <td className="border-r border-border/30 px-3 py-2 text-center text-sm text-muted-foreground">
                            {member.이메일 || "-"}
                          </td>
                          <td className="border-r border-border/30 px-3 py-2 text-center text-sm text-muted-foreground">
                            {member.연락처 || "-"}
                          </td>
                          <td className="px-3 py-2 text-center text-sm text-muted-foreground">
                            {member.부서 || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
