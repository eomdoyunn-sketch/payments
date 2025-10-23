"use client"

// Admin 페이지 클라이언트 컴포넌트
import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { CompanyProductTable } from "@/components/admin/CompanyProductTable"
import { WhitelistManagementModal } from "@/components/admin/WhitelistManagementModal"
import { CompanyForm } from "@/components/admin/CompanyForm"
import { toast } from "sonner"
import {
  toggleCompanyStatus,
  updateCompany,
  createCompany,
  deleteCompany,
} from "@/app/actions/companies"
import {
  saveGlobalSettings,
  resetSettings,
  getGlobalSettings,
} from "@/app/actions/settings"
// 실시간 구독 기능 임시 비활성화 (오류 해결을 위해)
import { useOptimizedCompanies } from "@/hooks/useOptimizedState"
import { useCompanyStatusDebounce } from "@/hooks/useDebouncedSave"
import { DEFAULT_SETTINGS, type GlobalSettings } from "@/lib/default-settings"
import {
  Save,
  RotateCcw,
  DollarSign,
  Settings as SettingsIcon,
  Building2,
  RefreshCw,
} from "lucide-react"

type CompanyData = {
  id?: number | string
  code: string
  name: string
  status: 'active' | 'inactive'
  quota?: { fullDay: number; morning: number; evening: number }
  mode?: 'FCFS' | 'WHL'
  registered?: number
  remaining?: number
  [key: string]: unknown
}

type PaymentData = {
  id: string
  payment_date: string
  company: string
  employee_id: string
  name: string
  gender: '남' | '여'
  membership_type: string
  membership_period: number
  has_locker: boolean
  locker_period: number
  locker_number?: string
  price: number
  status: string
  processed: boolean
  memo?: string
}

interface AdminPageClientProps {
  initialCompanies: CompanyData[]
  initialRealTimeStats: Array<{ code: string; name: string; registered: number }>
  initialPayments: PaymentData[]
  initialStats: {
    totalPayments: number
    totalAmount: number
    processedPayments: number
    pendingPayments: number
    completedPayments: number
  }
  initialSettings: GlobalSettings | null
}

export function AdminPageClient({
  initialCompanies,
  initialRealTimeStats,
  initialPayments,
  initialStats,
  initialSettings,
}: AdminPageClientProps) {
  const router = useRouter()
  const [isClient, setIsClient] = React.useState(false)

  // 최적화된 상태 관리
  const {
    companies,
    toggleCompanyStatus: updateCompanyStatus,
    updateCompanyInfo,
    setCompanies
  } = useOptimizedCompanies(initialCompanies)

  // 디바운스된 저장
  const { addChange: addCompanyChange, pendingCount, isSaving } = useCompanyStatusDebounce()

  // 설정 상태
  const [settings, setSettings] = React.useState<GlobalSettings>(
    initialSettings || DEFAULT_SETTINGS
  )
  const [realTimeStats, setRealTimeStats] = React.useState(initialRealTimeStats)
  
  // 전역 설정 초기화 (컴포넌트 마운트 시)
  React.useEffect(() => {
    const initializeSettings = async () => {
      try {
        const globalSettings = await getGlobalSettings()
        setSettings(globalSettings)
      } catch (error) {
        console.error('전역 설정 초기화 실패:', error)
        setSettings(DEFAULT_SETTINGS)
      }
    }
    
    initializeSettings()
  }, [])
  
  // 모달 상태
  const [showUploadModal, setShowUploadModal] = React.useState(false)
  const [selectedCompanyForUpload, setSelectedCompanyForUpload] = React.useState<string | null>(null)
  const [selectedProductType, setSelectedProductType] = React.useState<"fullDay" | "morning" | "evening">("fullDay")
  
  // 계열사 편집 모달 상태
  const [showCompanyEditModal, setShowCompanyEditModal] = React.useState(false)
  const [selectedCompany, setSelectedCompany] = React.useState<CompanyData | null>(null)
  
  // 계열사 추가 모달 상태
  const [showCompanyAddModal, setShowCompanyAddModal] = React.useState(false)
  
  // 계열사 삭제 확인 다이얼로그 상태
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = React.useState(false)
  const [companyToDelete, setCompanyToDelete] = React.useState<CompanyData | null>(null)

  // Hydration 문제 해결
  React.useEffect(() => {
    setIsClient(true)
  }, [])


  // 설정 업데이트 핸들러
  const updateSettings = (updates: Partial<GlobalSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
      membershipPrices: {
        ...prev.membershipPrices,
        ...(updates.membershipPrices || {}),
      },
      membershipPeriod: updates.membershipPeriod ?? prev.membershipPeriod,
      productStatus: updates.productStatus
        ? {
            memberships: {
              ...prev.productStatus.memberships,
              ...(updates.productStatus.memberships || {}),
            },
            locker: updates.productStatus.locker ?? prev.productStatus.locker,
          }
        : prev.productStatus,
      registrationPeriod: {
        ...prev.registrationPeriod,
        ...(updates.registrationPeriod || {}),
      },
    }))
  }

  // 설정 저장 핸들러
  const handleSaveSettings = async () => {
    try {
      console.log('💾 어드민에서 저장할 설정:', settings.membershipPrices)
      
      // Server Action 호출 시 네트워크 에러 처리
      const result = await saveGlobalSettings(settings)
      
      if (result && result.error) {
        throw new Error(result.error)
      }
      
      const priceInfo = [
        `종일권: ₩${settings.membershipPrices.fullDay.toLocaleString()}`,
        `오전권: ₩${settings.membershipPrices.morning.toLocaleString()}`,
        `저녁권: ₩${settings.membershipPrices.evening.toLocaleString()}`,
      ].join(', ')
      
      toast.success("설정이 성공적으로 저장되었습니다!", {
        description: `가격: ${priceInfo}. 모든 변경사항이 고객 결제 페이지에 즉시 반영됩니다.`
      })
      
      // 실시간 업데이트 - 페이지 새로고침 없이 즉시 반영
      router.refresh()
    } catch (error) {
      console.error('설정 저장 중 오류:', error)
      
      let errorMessage = '알 수 없는 오류가 발생했습니다'
      
      if (error instanceof Error) {
        console.error('오류 상세 정보:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
        
        if (error.message.includes('fetch')) {
          errorMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.'
        } else if (error.message.includes('Supabase')) {
          errorMessage = '데이터베이스 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.'
        } else if (error.message.includes('인증')) {
          errorMessage = '로그인이 필요합니다. 페이지를 새로고침해주세요.'
        } else {
          errorMessage = error.message
        }
      }
      
      toast.error("설정 저장 실패", {
        description: errorMessage
      })
    }
  }

  // 설정 초기화 핸들러
  const handleResetSettings = async () => {
    if (confirm('모든 설정을 초기화하시겠습니까?')) {
      try {
        await resetSettings()
        setSettings(DEFAULT_SETTINGS)
        toast.success('설정이 초기화되었습니다!')
        router.refresh()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
        toast.error('설정 초기화 실패', {
          description: errorMessage
        })
      }
    }
  }

  // 새로고침 핸들러
  const handleRefresh = () => {
    toast.info("데이터를 새로고침합니다...")
    router.refresh()
  }

  // 최적화된 계열사 상태 토글 핸들러
  const handleToggleCompanyStatus = React.useCallback((id: string | number, checked: boolean) => {
    try {
      console.log(`🔄 계열사 상태 토글 시작: id=${id}, checked=${checked}`)
      
      // 회사 정보에서 code 찾기
      const company = companies.find(c => c.id === id)
      if (!company) {
        console.error('❌ 회사 정보를 찾을 수 없음:', { id, companies: companies.map(c => ({ id: c.id, code: c.code })) })
        toast.error('회사 정보를 찾을 수 없습니다')
        return
      }

      console.log(`📋 회사 정보 확인:`, { id: company.id, code: company.code, name: company.name })

      // 1. 즉시 UI 업데이트 (사용자 경험)
      updateCompanyStatus(id, checked ? 'active' : 'inactive')
      
      // 2. 디바운스된 저장 (성능 최적화) - code 사용
      addCompanyChange(company.code, { status: checked ? 'active' : 'inactive' })
      
      toast.success(`계열사 상태가 ${checked ? "활성" : "비활성"}으로 변경되었습니다!`)
      
    } catch (error) {
      console.error('❌ 계열사 상태 토글 실패:', error)
      toast.error('상태 변경 중 오류가 발생했습니다')
    }
  }, [companies, updateCompanyStatus, addCompanyChange])

  // 계열사 편집 핸들러
  const handleEditCompany = (company: CompanyData) => {
    setSelectedCompany(company)
    setShowCompanyEditModal(true)
  }

  // 계열사 추가 핸들러
  const handleAddCompany = () => {
    setShowCompanyAddModal(true)
  }

  // 계열사 추가 저장 핸들러
  const handleSaveNewCompany = async (data: Partial<CompanyData>) => {
    try {
      console.log('🔄 새 계열사 추가 시작:', data)

      // 1. 서버에 계열사 생성
      const newCompany = await createCompany({
        name: data.name || '',
        quota: data.quota || { fullDay: 0, morning: 0, evening: 0 },
        mode: data.mode as 'FCFS' | 'WHL' || 'FCFS',
        status: data.status || (data.isActive ? 'active' : 'inactive'),
        contactPerson: data.contactPerson || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
      })

      // 2. UI에 새 계열사 추가
      const companyData: CompanyData = {
        id: newCompany.id,
        code: newCompany.code,
        name: newCompany.name,
        status: newCompany.status,
        quota: newCompany.quota,
        mode: newCompany.mode,
        registered: 0,
        remaining: (newCompany.quota?.fullDay || 0) + (newCompany.quota?.morning || 0) + (newCompany.quota?.evening || 0),
      }

      setCompanies(prev => [...prev, companyData])
      
      toast.success('새 계열사가 성공적으로 추가되었습니다!')
      setShowCompanyAddModal(false)
      
      console.log('✅ 새 계열사 추가 완료')
      
    } catch (error) {
      console.error('❌ 계열사 추가 실패:', error)
      toast.error('계열사 추가 중 오류가 발생했습니다')
    }
  }

  // 계열사 삭제 확인 핸들러
  const handleDeleteCompany = (companyId: string | number) => {
    const company = companies.find(c => c.id === companyId || c.code === companyId)
    if (!company) {
      toast.error('계열사를 찾을 수 없습니다')
      return
    }

    // 삭제 확인 다이얼로그 표시
    setCompanyToDelete(company)
    setShowDeleteConfirmModal(true)
  }

  // 실제 삭제 실행 핸들러
  const handleConfirmDelete = async () => {
    if (!companyToDelete) return

    try {
      console.log('🔄 계열사 삭제 시작:', companyToDelete.code)

      // 1. 서버에서 계열사 삭제
      await deleteCompany(companyToDelete.code)

      // 2. UI에서 계열사 제거
      setCompanies(prev => prev.filter(c => c.id !== companyToDelete.id && c.code !== companyToDelete.code))
      
      toast.success(`${companyToDelete.name} 계열사가 성공적으로 삭제되었습니다!`)
      
      console.log('✅ 계열사 삭제 완료')
      
      // 다이얼로그 닫기
      setShowDeleteConfirmModal(false)
      setCompanyToDelete(null)
      
    } catch (error: any) {
      console.error('❌ 계열사 삭제 실패:', error)
      if (error.message.includes('등록된 사용자가 있어')) {
        toast.error('등록된 사용자가 있어 삭제할 수 없습니다')
      } else {
        toast.error('계열사 삭제 중 오류가 발생했습니다')
      }
    }
  }

  // 삭제 취소 핸들러
  const handleCancelDelete = () => {
    setShowDeleteConfirmModal(false)
    setCompanyToDelete(null)
  }

  // 최적화된 계열사 저장 핸들러
  const handleSaveCompany = async (data: Partial<CompanyData>) => {
    if (!selectedCompany?.code) {
      toast.error('계열사 코드가 없습니다')
      return
    }

    try {
      console.log('🔄 계열사 정보 수정 시작:', {
        code: selectedCompany.code,
        mode: data.mode,
        name: data.name
      })

      // 1. 즉시 UI 업데이트 (사용자 경험)
      updateCompanyInfo(selectedCompany.id, {
        name: data.name,
        status: data.status || (data.isActive ? 'active' : 'inactive'),
        mode: data.mode as 'FCFS' | 'WHL',
        quota: data.quota,
      })
      
      // 2. 백그라운드에서 서버 업데이트
      await updateCompany(selectedCompany.code, {
        name: data.name,
        status: data.status || (data.isActive ? 'active' : 'inactive'),
        mode: data.mode as 'FCFS' | 'WHL',
        quota: data.quota,
      })
      
      toast.success('계열사 정보가 성공적으로 수정되었습니다!')
      setShowCompanyEditModal(false)
      setSelectedCompany(null)
      
      // 페이지 새로고침 대신 선택적 상태 업데이트
      console.log('✅ 계열사 정보 수정 완료')
      
    } catch (error) {
      console.error('❌ 계열사 수정 실패:', error)
      
      // 실패 시 UI 롤백
      if (selectedCompany) {
        updateCompanyInfo(selectedCompany.id, selectedCompany)
      }
      
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      toast.error('계열사 수정 실패', {
        description: errorMessage
      })
    }
  }


  // 추첨 명단 업로드 핸들러
  const handleUploadWhitelist = (companyCode: string, productType: "fullDay" | "morning" | "evening") => {
    setSelectedCompanyForUpload(companyCode)
    setSelectedProductType(productType)
    setShowUploadModal(true)
  }


  // 실시간 데이터와 병합된 계열사 목록
  const companiesWithRealTimeData = React.useMemo(() => {
    return initialCompanies.map(company => {
      const stat = realTimeStats.find(s => s.code === company.code)
      if (stat) {
        const allocatedTotal = company.quota 
          ? company.quota.fullDay + company.quota.morning + company.quota.evening 
          : 0
        return {
          ...company,
          registered: stat.registered,
          remaining: allocatedTotal - stat.registered
        }
      }
      return company
    })
  }, [initialCompanies, realTimeStats])

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <PageHeader
        title="통합 관리자 페이지"
        description="GYM29 회원권 및 개인사물함 등록/결제 관리 시스템"
      />

      {/* 전역 가격 설정 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">💰 전역 상품 가격 설정</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                상품 가격 설정
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRefresh} size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  새로고침
                </Button>
                <Button onClick={handleSaveSettings} size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  전역 설정 저장
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-4">회원권 가격 (월당)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 종일권 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fullDay">종일권</Label>
                    <Switch
                      checked={settings.productStatus.memberships.fullDay}
                      onCheckedChange={(checked) => updateSettings({
                        productStatus: {
                          ...settings.productStatus,
                          memberships: { ...settings.productStatus.memberships, fullDay: checked }
                        }
                      })}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₩</span>
                    <Input
                      id="fullDay"
                      type="number"
                      value={settings.membershipPrices.fullDay}
                      onChange={(e) => updateSettings({
                        membershipPrices: { ...settings.membershipPrices, fullDay: Number(e.target.value) }
                      })}
                      className="pl-8"
                      disabled={!settings.productStatus.memberships.fullDay}
                    />
                  </div>
                </div>

                {/* 오전권 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="morning">오전권</Label>
                    <Switch
                      checked={settings.productStatus.memberships.morning}
                      onCheckedChange={(checked) => updateSettings({
                        productStatus: {
                          ...settings.productStatus,
                          memberships: { ...settings.productStatus.memberships, morning: checked }
                        }
                      })}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₩</span>
                    <Input
                      id="morning"
                      type="number"
                      value={settings.membershipPrices.morning}
                      onChange={(e) => updateSettings({
                        membershipPrices: { ...settings.membershipPrices, morning: Number(e.target.value) }
                      })}
                      className="pl-8"
                      disabled={!settings.productStatus.memberships.morning}
                    />
                  </div>
                </div>

                {/* 저녁권 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="evening">저녁권</Label>
                    <Switch
                      checked={settings.productStatus.memberships.evening}
                      onCheckedChange={(checked) => updateSettings({
                        productStatus: {
                          ...settings.productStatus,
                          memberships: { ...settings.productStatus.memberships, evening: checked }
                        }
                      })}
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₩</span>
                    <Input
                      id="evening"
                      type="number"
                      value={settings.membershipPrices.evening}
                      onChange={(e) => updateSettings({
                        membershipPrices: { ...settings.membershipPrices, evening: Number(e.target.value) }
                      })}
                      className="pl-8"
                      disabled={!settings.productStatus.memberships.evening}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 사물함 가격 */}
            <div>
              <h4 className="text-sm font-medium mb-4">개인사물함 가격</h4>
              <div className="max-w-sm space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="locker">개인사물함</Label>
                  <Switch
                    checked={settings.productStatus.locker}
                    onCheckedChange={(checked) => updateSettings({
                      productStatus: { ...settings.productStatus, locker: checked }
                    })}
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₩</span>
                  <Input
                    id="locker"
                    type="number"
                    value={settings.lockerPrice}
                    onChange={(e) => updateSettings({ lockerPrice: Number(e.target.value) })}
                    className="pl-8"
                    disabled={!settings.productStatus.locker}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* 이용기간 설정 */}
            <div>
              <h4 className="text-sm font-medium mb-4">이용기간 설정</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="membershipPeriod">회원권 이용기간</Label>
                  <div className="relative">
                    <Input
                      id="membershipPeriod"
                      type="number"
                      value={settings.membershipPeriod}
                      onChange={(e) => updateSettings({ membershipPeriod: Number(e.target.value) })}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">개월</span>
                  </div>
                  <p className="text-xs text-muted-foreground">모든 회원권의 공통 이용기간입니다</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockerPeriod">사물함 이용기간</Label>
                  <div className="relative">
                    <Input
                      id="lockerPeriod"
                      type="number"
                      value={settings.lockerPeriod}
                      onChange={(e) => updateSettings({ lockerPeriod: Number(e.target.value) })}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">개월</span>
                  </div>
                  <p className="text-xs text-muted-foreground">개인사물함의 이용기간입니다</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h5 className="text-sm font-medium mb-4">이용 시작 날짜 설정</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="membershipStartDate">회원권 시작 날짜</Label>
                    <Input
                      id="membershipStartDate"
                      type="date"
                      value={settings.membershipStartDate}
                      onChange={(e) => updateSettings({ membershipStartDate: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">회원권 이용이 시작되는 날짜입니다</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockerStartDate">사물함 시작 날짜</Label>
                    <Input
                      id="lockerStartDate"
                      type="date"
                      value={settings.lockerStartDate}
                      onChange={(e) => updateSettings({ lockerStartDate: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">사물함 이용이 시작되는 날짜입니다</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* 계열사 등록 현황 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">🏢 계열사 등록 현황</h2>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            새로고침
          </Button>
        </div>
        <CompanyProductTable
          companies={companies.map(company => ({
            ...company,
            id: company.id || company.code,
            mode: company.mode || 'FCFS',
            quota: company.quota || { fullDay: 0, morning: 0, evening: 0 }
          }))}
          onEdit={(company) => handleEditCompany(company as any)}
          onDelete={handleDeleteCompany}
          onToggleStatus={handleToggleCompanyStatus}
          onUploadWhitelist={handleUploadWhitelist}
          onAddCompany={handleAddCompany}
        />
      </div>


      {/* 추첨 명단 관리 모달 */}
      {selectedCompanyForUpload && (
        <WhitelistManagementModal
          open={showUploadModal}
          onOpenChange={setShowUploadModal}
          companyCode={selectedCompanyForUpload}
          companyName={initialCompanies.find(c => c.code === selectedCompanyForUpload)?.name || ""}
          productType={selectedProductType}
          allocatedTotal={
            initialCompanies.find(c => c.code === selectedCompanyForUpload)?.quota?.[selectedProductType] || 0
          }
        />
      )}

      {/* 계열사 편집 모달 */}
      {selectedCompany && (
        <CompanyForm
          open={showCompanyEditModal}
          onOpenChange={setShowCompanyEditModal}
          mode="edit"
          company={{
            ...selectedCompany,
            isActive: selectedCompany.status === 'active'
          }}
          onSave={handleSaveCompany}
          onCancel={() => {
            setShowCompanyEditModal(false)
            setSelectedCompany(null)
          }}
          registrationPeriod={settings.registrationPeriod}
        />
      )}

      {/* 계열사 추가 모달 */}
      <CompanyForm
        open={showCompanyAddModal}
        onOpenChange={setShowCompanyAddModal}
        mode="create"
        onSave={handleSaveNewCompany}
        onCancel={() => {
          setShowCompanyAddModal(false)
        }}
        registrationPeriod={settings.registrationPeriod}
      />

      {/* 계열사 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">⚠️ 계열사 삭제 확인</DialogTitle>
            <DialogDescription>
              정말로 <strong>{companyToDelete?.name}</strong> 계열사를 삭제하시겠습니까?
              <br />
              <br />
              <span className="text-destructive font-medium">
                ⚠️ 이 작업은 되돌릴 수 없으며, 해당 계열사의 모든 데이터가 영구적으로 삭제됩니다.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancelDelete}
            >
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              네, 삭제하겠습니다
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

