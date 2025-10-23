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
import { Upload, CheckCircle, XCircle, FileSpreadsheet } from "lucide-react"

type ExcelMember = {
  사번: string
  이름: string
  이메일?: string
  연락처?: string
}

type ExcelUploadModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  loginInfo: {
    empNo: string
    name: string
  }
  onMatch: (matched: boolean) => void
}

export function ExcelUploadModal({
  open,
  onOpenChange,
  loginInfo,
  onMatch
}: ExcelUploadModalProps) {
  const [members, setMembers] = React.useState<ExcelMember[]>([])
  const [isMatched, setIsMatched] = React.useState<boolean | null>(null)
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

        setMembers(jsonData)

        // 명단 매칭 확인
        const matched = jsonData.some(
          (member) =>
            member.사번 === loginInfo.empNo && member.이름 === loginInfo.name
        )
        
        setIsMatched(matched)
        onMatch(matched)
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
    if (!isMatched) {
      setMembers([])
      setIsMatched(null)
      onMatch(false)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            추첨제 명단 확인
          </DialogTitle>
          <DialogDescription>
            관리자가 제공한 엑셀 파일을 업로드하여 추첨 명단을 확인하세요.
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
              <Button onClick={handleButtonClick} disabled={isUploading}>
                {isUploading ? "업로드 중..." : "파일 선택"}
              </Button>
            </div>

            {/* 업로드 안내 */}
            <Alert>
              <AlertDescription className="text-sm">
                <strong>엑셀 파일 형식:</strong> 첫 번째 행은 헤더(사번, 이름, 이메일, 연락처)이고, 
                두 번째 행부터 데이터가 있어야 합니다.
              </AlertDescription>
            </Alert>
          </div>

          {/* 매칭 결과 */}
          {isMatched !== null && (
            <Alert variant={isMatched ? "default" : "destructive"}>
              {isMatched ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">명단 확인 완료!</p>
                      <p className="text-sm">
                        {loginInfo.name}({loginInfo.empNo})님은 추첨제 대상자입니다. 
                        결제를 진행해 주세요.
                      </p>
                    </div>
                  </AlertDescription>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">명단에서 확인되지 않았습니다.</p>
                      <p className="text-sm">
                        {loginInfo.name}({loginInfo.empNo})님은 추첨제 대상자가 아닙니다. 
                        회사 담당자에게 문의해 주세요.
                      </p>
                    </div>
                  </AlertDescription>
                </>
              )}
            </Alert>
          )}

          {/* 업로드된 명단 테이블 */}
          {members.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">업로드된 명단 ({members.length}명)</h3>
              <div className="border border-border rounded-md overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">번호</th>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">사번</th>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">이름</th>
                        <th className="text-center text-foreground border-r border-border/50 px-3 py-2">이메일</th>
                        <th className="text-center text-foreground px-3 py-2">연락처</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member, index) => {
                        const isCurrentUser = 
                          member.사번 === loginInfo.empNo && 
                          member.이름 === loginInfo.name
                        
                        return (
                          <tr 
                            key={index}
                            className={`${
                              index % 2 === 0 ? "bg-background" : "bg-muted/20"
                            } ${isCurrentUser ? "bg-primary/10" : ""}`}
                          >
                            <td className="border-r border-border/30 px-3 py-2 text-center text-sm">
                              {index + 1}
                            </td>
                            <td className="border-r border-border/30 px-3 py-2 text-center text-sm">
                              {member.사번}
                              {isCurrentUser && (
                                <CheckCircle className="inline-block ml-2 h-3 w-3 text-primary" />
                              )}
                            </td>
                            <td className="border-r border-border/30 px-3 py-2 text-center">
                              {member.이름}
                            </td>
                            <td className="border-r border-border/30 px-3 py-2 text-center text-sm text-muted-foreground">
                              {member.이메일 || "-"}
                            </td>
                            <td className="px-3 py-2 text-center text-sm text-muted-foreground">
                              {member.연락처 || "-"}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 영역 */}
          {isMatched !== null && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                닫기
              </Button>
              {isMatched && (
                <Button onClick={() => onOpenChange(false)}>
                  결제 진행
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


