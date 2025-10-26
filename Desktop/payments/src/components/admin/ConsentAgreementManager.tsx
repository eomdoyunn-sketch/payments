"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Save, Edit, Eye, EyeOff } from "lucide-react"
import { AGREEMENTS } from "@/lib/agreements"

const DEFAULT_SERVICE_CONTENT =
  AGREEMENTS.find((agreement) => agreement.type === "service")?.content ??
  "서비스 이용약관 내용을 등록해주세요."

const DEFAULT_PRIVACY_CONSENT_CONTENT =
  AGREEMENTS.find((agreement) => agreement.type === "privacy")?.content ??
  "개인정보 수집 및 이용 동의 내용을 등록해주세요."

const DEFAULT_PRIVACY_POLICY_CONTENT =
  "개인정보처리방침 기본 내용입니다. 관리자에서 최신 내용을 등록하세요."

const MANAGED_AGREEMENTS = [
  {
    title: "개인정보처리방침",
    description: "로그인, 회원 가입 등에서 노출되는 기본 개인정보처리방침입니다.",
    defaultVersion: "1.0",
    defaultRequired: false,
    defaultHasDetailView: true,
    defaultContent: DEFAULT_PRIVACY_POLICY_CONTENT,
  },
  {
    title: "서비스 이용약관",
    description: "회원 가입 시 필수로 동의 받아야 하는 서비스 이용약관입니다.",
    defaultVersion: "1.0",
    defaultRequired: true,
    defaultHasDetailView: true,
    defaultContent: DEFAULT_SERVICE_CONTENT,
  },
  {
    title: "개인정보 수집 및 이용 동의",
    description: "회원 가입 시 필수로 동의 받아야 하는 개인정보 처리 안내입니다.",
    defaultVersion: "1.0",
    defaultRequired: true,
    defaultHasDetailView: true,
    defaultContent: DEFAULT_PRIVACY_CONSENT_CONTENT,
  },
] as const

type ManagedAgreementConfig = (typeof MANAGED_AGREEMENTS)[number]

interface ConsentAgreement {
  id: string
  title: string
  content: string
  version: string | null
  is_active: boolean
  is_required: boolean | null
  has_detail_view: boolean | null
  created_at: string | null
  updated_at: string | null
}

interface AgreementFormState {
  title: string
  content: string
  version: string
  is_active: boolean
  is_required: boolean
  has_detail_view: boolean
}

const managedTitles = MANAGED_AGREEMENTS.map((config) => config.title)

export function ConsentAgreementManager() {
  const supabase = createClient()
  const [agreements, setAgreements] = React.useState<ConsentAgreement[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState<AgreementFormState>({
    title: "",
    content: "",
    version: "1.0",
    is_active: true,
    is_required: true,
    has_detail_view: true,
  })

  const fetchAgreements = React.useCallback(async () => {
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from("consent_agreements")
        .select("*")
        .in("title", managedTitles)

      if (error) {
        throw error
      }

      let records = data ?? []

      const missingConfigs = MANAGED_AGREEMENTS.filter(
        (config) => !records.some((record) => record.title === config.title),
      )

      if (missingConfigs.length > 0) {
        const inserts = missingConfigs.map((config) => ({
          title: config.title,
          content: config.defaultContent,
          version: config.defaultVersion,
          is_active: true,
          is_required: config.defaultRequired,
          has_detail_view: config.defaultHasDetailView,
        }))

        const { error: insertError } = await supabase.from("consent_agreements").insert(inserts)

        if (insertError) {
          console.error("동의서 기본값 생성 실패:", insertError)
          toast.error("기본 동의서를 생성하지 못했습니다. 직접 항목을 추가해주세요.")
        } else {
          const { data: refreshed, error: refreshError } = await supabase
            .from("consent_agreements")
            .select("*")
            .in("title", managedTitles)

          if (!refreshError && refreshed) {
            records = refreshed
          }
        }
      }

      const ordered = managedTitles
        .map((title) => records.find((record) => record.title === title))
        .filter(Boolean) as ConsentAgreement[]

      setAgreements(ordered)
    } catch (error) {
      console.error("동의서 목록 불러오기 실패:", error)
      toast.error("동의서를 불러오지 못했습니다.")
      setAgreements([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  React.useEffect(() => {
    fetchAgreements()
  }, [fetchAgreements])

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      version: "1.0",
      is_active: true,
      is_required: true,
      has_detail_view: true,
    })
    setEditingId(null)
  }

  const startEdit = (agreement: ConsentAgreement) => {
    setFormData({
      title: agreement.title,
      content: agreement.content,
      version: agreement.version || "1.0",
      is_active: agreement.is_active,
      is_required: agreement.is_required ?? true,
      has_detail_view: agreement.has_detail_view ?? true,
    })
    setEditingId(agreement.id)
  }

  const handleSave = async () => {
    if (!editingId) {
      toast.error("수정할 동의서가 선택되지 않았습니다.")
      return
    }

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        version: formData.version,
        is_active: formData.is_active,
        is_required: formData.is_required,
        has_detail_view: formData.has_detail_view,
      }

      const { error } = await supabase.from("consent_agreements").update(payload).eq("id", editingId)

      if (error) {
        throw error
      }

      toast.success("동의서가 업데이트되었습니다.")
      resetForm()
      fetchAgreements()
    } catch (error) {
      console.error("동의서 저장 실패:", error)
      toast.error("동의서를 저장하지 못했습니다.")
    }
  }

  const toggleActive = async (agreement: ConsentAgreement) => {
    const nextActive = !agreement.is_active

    try {
      const { error } = await supabase
        .from("consent_agreements")
        .update({ is_active: nextActive })
        .eq("id", agreement.id)

      if (error) {
        throw error
      }

      setAgreements((prev) =>
        prev.map((item) =>
          item.id === agreement.id
            ? {
                ...item,
                is_active: nextActive,
              }
            : item,
        ),
      )

      toast.success(
        `${agreement.title}이(가) ${nextActive ? "활성화" : "비활성화"} 상태로 변경되었습니다.`,
      )
    } catch (error) {
      console.error("활성 상태 변경 실패:", error)
      toast.error("활성 상태를 변경하지 못했습니다.")
    }
  }

  const getConfig = (title: string): ManagedAgreementConfig | undefined => {
    return MANAGED_AGREEMENTS.find((config) => config.title === title)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>전역 동의서 관리</CardTitle>
          <CardDescription>
            홈페이지와 회원 가입 화면에서 사용하는 3개의 동의서를 관리합니다. 내용을 수정하면 즉시
            사용자 화면에 반영됩니다.
          </CardDescription>
        </CardHeader>
      </Card>

      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>동의서 내용 수정</CardTitle>
            <CardDescription>선택한 동의서의 버전과 내용을 업데이트합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" value={formData.title} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="version">버전</Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    version: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: event.target.value,
                  }))
                }
                className="min-h-[240px] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: checked,
                    }))
                  }
                />
                <Label htmlFor="is_active">사용 여부</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_required"
                  checked={formData.is_required}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_required: checked,
                    }))
                  }
                />
                <Label htmlFor="is_required">필수 동의</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="has_detail_view"
                  checked={formData.has_detail_view}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      has_detail_view: checked,
                    }))
                  }
                />
                <Label htmlFor="has_detail_view">상세 보기 노출</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                저장
              </Button>
              <Button variant="outline" onClick={resetForm}>
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              동의서를 불러오는 중입니다...
            </CardContent>
          </Card>
        )}

        {!loading &&
          agreements.map((agreement) => {
            const config = getConfig(agreement.title)

            return (
              <Card key={agreement.id}>
                <CardHeader>
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex flex-wrap items-center gap-2">
                        {agreement.title}
                        <Badge variant={agreement.is_active ? "default" : "secondary"}>
                          {agreement.is_active ? "사용 중" : "비활성"}
                        </Badge>
                        <Badge variant={agreement.is_required ? "destructive" : "outline"}>
                          {agreement.is_required ? "필수" : "선택"}
                        </Badge>
                        {agreement.version && (
                          <Badge variant="outline">v{agreement.version}</Badge>
                        )}
                      </CardTitle>
                      {config && <CardDescription>{config.description}</CardDescription>}
                      {agreement.updated_at && (
                        <p className="text-xs text-muted-foreground">
                          마지막 수정:{" "}
                          {new Date(agreement.updated_at).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(agreement)}
                        className="flex items-center gap-1"
                      >
                        {agreement.is_active ? (
                          <>
                            <EyeOff className="h-4 w-4" />
                            비활성화
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                            활성화
                          </>
                        )}
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => startEdit(agreement)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        수정
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap text-sm text-muted-foreground">
                      {agreement.content}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            )
          })}

        {!loading && agreements.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              관리할 동의서를 찾을 수 없습니다. 직접 동의서를 추가해주세요.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
