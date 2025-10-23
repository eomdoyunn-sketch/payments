"use client"

// Admin 페이지 클라이언트 컴포넌트
import * as React from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { CompanyProductTable } from "@/components/admin/CompanyProductTable"
import { PaymentDataTable } from "@/components/admin/PaymentDataTable"
import { WhitelistManagementModal } from "@/components/admin/WhitelistManagementModal"
import { CompanyForm } from "@/components/admin/CompanyForm"
import { toast } from "sonner"
import {
  toggleCompanyStatus,
  updateCompany,
} from "@/app/actions/companies"
import {
  updatePaymentProcessed,
  updateLockerNumber,
  updatePaymentMemo,
} from "@/app/actions/payments"
import {
  saveGlobalSettings,
  resetSettings,
  getGlobalSettings,
} from "@/app/actions/settings"
import { DEFAULT_SETTINGS, type GlobalSettings } from "@/lib/default-settings"
import {
  Save,
  RotateCcw,
  CreditCard,
  DollarSign,
  Settings as SettingsIcon,
  Building2,
  Users,
  Download,
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

  // 상태 관리
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

  // Hydration 문제 해결
  React.useEffect(() => {
    setIsClient(true)
  }, [])

  // 실시간 업데이트 구독
  React.useEffect(() => {
    if (!isClient) return

    const supabase = createClient()

    // Realtime 채널 생성
    const channel = supabase
      .channel('admin-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies'
        },
        (payload) => {
          console.log('Companies 변경 감지:', payload)
          // 서버 데이터 새로고침
          router.refresh()
          toast.info('계열사 정보가 업데이트되었습니다')
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          console.log('User profiles 변경 감지:', payload)
          // 등록 현황 새로고침
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        (payload) => {
          console.log('Payments 변경 감지:', payload)
          router.refresh()
          toast.info('결제 정보가 업데이트되었습니다')
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'settings'
        },
        async (payload) => {
          console.log('Settings 변경 감지:', payload)
          try {
            // 전역 설정 다시 로드
            const updatedSettings = await getGlobalSettings()
            setSettings(updatedSettings)
            toast.info('전역 설정이 업데이트되었습니다')
          } catch (error) {
            console.error('설정 업데이트 실패:', error)
          }
        }
      )
      .subscribe()

    // 정기적 새로고침 (30초마다)
    const intervalId = setInterval(() => {
      router.refresh()
    }, 30000)

    // 클린업
    return () => {
      supabase.removeChannel(channel)
      clearInterval(intervalId)
    }
  }, [isClient, router])

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
      
      // 홈페이지와 어드민 페이지 모두 새로고침
      router.refresh()
      window.location.reload()
    } catch (error) {
      console.error('설정 저장 중 오류:', error)
      
      let errorMessage = '알 수 없는 오류가 발생했습니다'
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.'
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

  // 계열사 상태 토글 핸들러
  const handleToggleCompanyStatus = async (code: string, checked: boolean) => {
    try {
      await toggleCompanyStatus(code, checked ? 'active' : 'inactive')
      toast.success(`계열사 상태가 ${checked ? "활성" : "비활성"}으로 변경되었습니다!`)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      toast.error('상태 변경 실패', {
        description: errorMessage
      })
    }
  }

  // 계열사 편집 핸들러
  const handleEditCompany = (company: CompanyData) => {
    setSelectedCompany(company)
    setShowCompanyEditModal(true)
  }

  // 계열사 저장 핸들러
  const handleSaveCompany = async (data: Partial<CompanyData>) => {
    if (!selectedCompany?.code) {
      toast.error('계열사 코드가 없습니다')
      return
    }

    try {
      await updateCompany(selectedCompany.code, {
        name: data.name,
        status: data.status || (data.isActive ? 'active' : 'inactive'),
        mode: data.mode as 'FCFS' | 'WHL',
        quota: data.quota,
      })
      
      toast.success('계열사 정보가 성공적으로 수정되었습니다!')
      setShowCompanyEditModal(false)
      setSelectedCompany(null)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      toast.error('계열사 수정 실패', {
        description: errorMessage
      })
    }
  }

  // 결제 처리 핸들러
  const handleProcessed = async (ids: string[]) => {
    try {
      await updatePaymentProcessed(ids, true)
      toast.success(`${ids.length}건의 결제가 처리 완료되었습니다!`)
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      toast.error('결제 처리 실패', {
        description: errorMessage
      })
    }
  }

  // 결제 처리 상태 토글 핸들러
  const handleToggleProcessed = async (id: string) => {
    try {
      await updatePaymentProcessed([id], true)
      toast.success('처리 상태가 변경되었습니다!')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      toast.error('상태 변경 실패', {
        description: errorMessage
      })
    }
  }

  // 사물함 번호 업데이트 핸들러
  const handleUpdateLockerNumber = async (id: string, lockerNumber: string) => {
    try {
      await updateLockerNumber(id, lockerNumber)
      toast.success('사물함 번호가 업데이트되었습니다!')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      toast.error('사물함 번호 업데이트 실패', {
        description: errorMessage
      })
    }
  }

  // 메모 업데이트 핸들러
  const handleUpdateMemo = async (id: string, memo: string) => {
    try {
      await updatePaymentMemo(id, memo)
      toast.success('메모가 업데이트되었습니다!')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다'
      toast.error('메모 업데이트 실패', {
        description: errorMessage
      })
    }
  }

  // 환불 처리 핸들러
  const handleRefund = async (id: number, reason: string) => {
    try {
      const response = await fetch('/api/payment/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentId: id,
          reason: reason
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('환불이 완료되었습니다.')
        router.refresh()
      } else {
        toast.error(result.error || '환불 처리에 실패했습니다.')
      }
    } catch (error) {
      console.error('환불 처리 실패:', error)
      toast.error('환불 처리 중 오류가 발생했습니다.')
    }
  }

  // 엑셀 다운로드 핸들러
  const handleExportPayments = () => {
    toast.info("결제 내역을 다운로드합니다...")
    // TODO: 실제 엑셀 다운로드 구현
  }

  // 추첨 명단 업로드 핸들러
  const handleUploadWhitelist = (companyCode: string, productType: "fullDay" | "morning" | "evening") => {
    setSelectedCompanyForUpload(companyCode)
    setSelectedProductType(productType)
    setShowUploadModal(true)
  }

  // 통계 계산
  const dashboardStats = React.useMemo(() => {
    const totalRegistered = realTimeStats.reduce((sum, stat) => sum + stat.registered, 0)
    const totalQuota = initialCompanies.reduce((sum, c) => {
      const quota = c.quota || { fullDay: 0, morning: 0, evening: 0 }
      return sum + quota.fullDay + quota.morning + quota.evening
    }, 0)

    return {
      ...initialStats,
      totalCompanies: initialCompanies.length,
      activeCompanies: initialCompanies.filter(c => c.status === 'active').length,
      totalQuota,
      totalRegistered,
      remainingQuota: totalQuota - totalRegistered,
    }
  }, [realTimeStats, initialCompanies, initialStats])

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
        action={
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
        }
      />

      {/* 대시보드 통계 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">📊 실시간 대시보드</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 결제 건수</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalPayments}</div>
              <p className="text-xs text-muted-foreground">
                처리완료: {dashboardStats.processedPayments} / 미처리: {dashboardStats.pendingPayments}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 결제 금액</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₩{dashboardStats.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">전체 누적 금액</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">활성 계열사</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.activeCompanies}/{dashboardStats.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">현재 운영 중인 계열사</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">등록 현황</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalRegistered}/{dashboardStats.totalQuota}</div>
              <p className="text-xs text-muted-foreground">
                잔여: {dashboardStats.remainingQuota}명
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 전역 가격 설정 */}
      <div>
        <h2 className="text-xl font-semibold mb-4">💰 전역 상품 가격 설정</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              상품 가격 설정
            </CardTitle>
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
        <h2 className="text-xl font-semibold mb-4">🏢 계열사 등록 현황</h2>
        <CompanyProductTable
          companies={companiesWithRealTimeData.map(company => ({
            ...company,
            id: company.id || company.code,
            mode: company.mode || 'FCFS',
            quota: company.quota || { fullDay: 0, morning: 0, evening: 0 }
          }))}
          onEdit={(company) => handleEditCompany(company as any)}
          onDelete={() => toast.info('계열사 삭제 기능은 준비 중입니다')}
          onToggleStatus={(id, checked) => {
            const company = companiesWithRealTimeData.find(c => c.id === id)
            if (company) {
              handleToggleCompanyStatus(company.code, checked)
            }
          }}
          onUploadWhitelist={handleUploadWhitelist}
        />
      </div>

      {/* 결제 내역 관리 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">💳 결제 내역 관리</h2>
          <Button variant="outline" onClick={handleExportPayments} size="sm">
            <Download className="mr-2 h-4 w-4" />
            엑셀 다운로드
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <PaymentDataTable
              data={initialPayments as any}
              onProcessed={handleProcessed as any}
              onToggleProcessed={handleToggleProcessed as any}
              onUpdateLockerNumber={handleUpdateLockerNumber as any}
              onUpdateMemo={handleUpdateMemo as any}
              onRefund={handleRefund}
              settings={{
                membershipStartDate: initialSettings?.membershipStartDate,
                membershipPeriod: initialSettings?.membershipPeriod,
                lockerStartDate: initialSettings?.lockerStartDate,
                lockerPeriod: initialSettings?.lockerPeriod
              }}
            />
          </CardContent>
        </Card>
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
    </div>
  )
}

