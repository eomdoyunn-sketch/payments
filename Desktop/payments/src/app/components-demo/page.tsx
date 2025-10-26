"use client"

import * as React from "react"
import { PaymentsCard } from "@/components/PaymentsCard"
import { Hero } from "@/components/Hero"
import { Header } from "@/components/Header"
import { RegistrationCompleteCard } from "@/components/RegistrationCompleteCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { NoticeCard } from "@/components/common/NoticeCard"
import { DataTable } from "@/components/admin/DataTable"
import { PaymentDataTable } from "@/components/admin/PaymentDataTable"
import { PaymentHistoryTable } from "@/components/admin/PaymentHistoryTable"
import { PageHeader } from "@/components/common/PageHeader"
import { ExcelUploadModal } from "@/components/admin/ExcelUploadModal"
import { PaymentStatusTable } from "@/components/admin/PaymentStatusTable"
import { CompanyComparisonTable } from "@/components/admin/CompanyComparisonTable"
import { SmartCompanyDashboard } from "@/components/admin/SmartCompanyDashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AgreementModal, AgreementList, Agreement } from "@/components/common/AgreementModal"
import { ExcelStyleAgreementManager } from "@/components/admin/ExcelStyleAgreementManager"
import { AGREEMENTS, getAgreementByType } from "@/lib/agreements"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EnvironmentCheck } from "@/components/EnvironmentCheck"
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal"
import { TermsAgreement } from "@/components/TermsAgreement"
// useSettings import 제거 (SettingsProvider 의존성 제거)

// 데모 사용자
const demoUser = {
  companyId: "B01",
  empNo: "20251234",
  name: "김도윤",
  preRegisteredProducts: ["full-day", "morning"] // 종일권과 오전권 미리 등록
}

const demoUserMismatch = {
  companyId: "B99",
  empNo: "99999999",
  name: "홍길동",
  preRegisteredProducts: [] // 등록 예정 명단에 없음
}

// WHL 모드용 데모 사용자 (저녁권만 등록)
const demoUserWHL = {
  companyId: "B01",
  empNo: "20251235",
  name: "이영희",
  preRegisteredProducts: ["evening"] // 저녁권만 미리 등록
}

// 데모 계열사
const demoCompanyFCFS = {
  id: "B01",
  name: "한화건설",
  quota: 50,
  registered: 38,
  remaining: 12,
  mode: "FCFS" as const,
  status: "active" as const,  // 계열사 활성 상태
  availableFrom: new Date("2025-10-07"),
  availableUntil: new Date("2025-10-11")
}

const demoCompanyWHL = {
  id: "B01",
  name: "한화건설",
  quota: 30,
  registered: 28,
  remaining: 2,
  mode: "WHL" as const,
  status: "active" as const,  // 계열사 활성 상태
  availableFrom: new Date("2025-10-07"),
  availableUntil: new Date("2025-10-11")
}

const demoCompanySoldOut = {
  id: "B01",
  name: "한화건설",
  quota: 20,
  registered: 20,
  remaining: 0,
  mode: "FCFS" as const,
  status: "active" as const,  // 계열사 활성 상태
  availableFrom: new Date("2025-10-07"),
  availableUntil: new Date("2025-10-11")
}

const demoCompanyExpired = {
  id: "B01",
  name: "한화건설",
  quota: 50,
  registered: 38,
  remaining: 12,
  mode: "FCFS" as const,
  status: "active" as const,  // 계열사 활성 상태
  availableFrom: new Date("2025-09-01"),
  availableUntil: new Date("2025-09-30")
}

// 데모 상품 (기본 가격 사용)
const getDemoProducts = (settings: any = null) => [
  {
    id: "full-day",
    name: "종일권",
    period: "3개월",
    price: settings?.membershipPrices?.fullDay || 99000,
    remaining: 6,
    startDate: "2025-10-15",
    endDate: "2026-01-14"
  },
  {
    id: "morning",
    name: "오전권",
    period: "3개월",
    price: settings?.membershipPrices?.morning || 66000,
    remaining: 4,
    startDate: "2025-10-15",
    endDate: "2026-01-14"
  },
  {
    id: "evening",
    name: "저녁권",
    period: "3개월",
    price: settings?.membershipPrices?.evening || 33000,
    remaining: 2,
    startDate: "2025-10-15",
    endDate: "2026-01-14"
  }
]

const getDemoProductsSoldOut = (settings: any = null) => [
  {
    id: "full-day",
    name: "종일권",
    period: "3개월",
    price: settings?.membershipPrices?.fullDay || 99000,
    remaining: 0,
    startDate: "2025-10-15",
    endDate: "2026-01-14"
  },
  {
    id: "morning",
    name: "오전권",
    period: "3개월",
    price: settings?.membershipPrices?.morning || 66000,
    remaining: 0,
    startDate: "2025-10-15",
    endDate: "2026-01-14"
  },
  {
    id: "evening",
    name: "저녁권",
    period: "3개월",
    price: settings?.membershipPrices?.evening || 33000,
    remaining: 0,
    startDate: "2025-10-15",
    endDate: "2026-01-14"
  }
]

// 데모 동의서 (기본 동의서 사용)
const getDemoAgreements = (settings: any = null, companyId: string = "B01") => [
  {
    type: "personal" as const,
    title: "개인정보 수집·이용 동의서",
    version: "v1.3",
    url: "https://aero.fit/legal/personal-v1.3.html"
  },
  {
    type: "sensitive" as const,
    title: "민감정보 처리 동의서",
    version: "v1.1",
    url: "https://aero.fit/legal/sensitive-v1.1.html"
  },
  {
    type: "utilization" as const,
    title: "정보활용 동의서",
    version: "v1.0",
    url: "https://aero.fit/legal/utilization-v1.0.html"
  }
].filter(agreement => {
  // 설정이 없으면 모든 동의서 활성화
  if (!settings?.companyAgreements) return true
  
  // 전역 설정에서 해당 동의서가 활성화되어 있는지 확인
  const companyAgreement = settings.companyAgreements.companies?.[companyId]?.[agreement.type] || 
                         settings.companyAgreements.default?.[agreement.type]
  return companyAgreement?.enabled ?? true
})

export default function ComponentsDemoPage() {
  // 기본 설정 사용 (SettingsProvider 의존성 제거)
  const settings = {
    membershipPrices: {
      fullDay: 99000,
      morning: 66000,
      evening: 33000
    },
    lockerPrice: 15000,
    productStatus: {
      memberships: {
        fullDay: true,
        morning: true,
        evening: true
      },
      locker: true
    },
    companyAgreements: {
      companies: {},
      default: {
        personal: { enabled: true, required: true, content: "개인정보 수집 및 이용에 동의합니다." },
        sensitive: { enabled: true, required: true, content: "민감정보 수집 및 이용에 동의합니다." },
        utilization: { enabled: true, required: true, content: "개인정보 제3자 제공에 동의합니다." },
        service: { enabled: true, required: true, content: "서비스 이용약관에 동의합니다." },
        privacy: { enabled: true, required: true, content: "개인정보처리방침에 동의합니다." }
      }
    }
  }
  
  // 동의서 관련 상태
  const [selectedAgreement, setSelectedAgreement] = React.useState<Agreement | null>(null)
  const [agreementModalOpen, setAgreementModalOpen] = React.useState(false)
  const [editingAgreement, setEditingAgreement] = React.useState<Agreement | null>(null)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [agreedStatus, setAgreedStatus] = React.useState<Record<string, boolean>>({
    personal: false,
    sensitive: false,
    utilization: false,
    service: false,
    privacy: false,
    marketing: false,
    shp: false,
    "shp-data": false
  })

  // 엑셀 업로드 및 결제 상태 확인 관련 상태
  const [showExcelUpload, setShowExcelUpload] = React.useState(false)
  const [paymentStatusData, setPaymentStatusData] = React.useState<any[]>([])

  // 데모 사용자들
  const demoRegularUser = {
    name: "김도윤",
    email: "doyun.kim@gym29.com",
    companyName: "한화건설",
    role: "user" as const
  }

  const demoAdminUser = {
    name: "관리자",
    email: "admin@gym29.com",
    companyName: "한화그룹",
    role: "admin" as const
  }

  // 로그인/로그아웃 핸들러
  const handleLogin = () => {
    console.log("로그인 클릭")
    alert("로그인 페이지로 이동합니다.")
  }

  const handleLogout = () => {
    console.log("로그아웃 클릭")
    alert("로그아웃 되었습니다.")
  }

  // 결제 처리 함수
  const handlePayment = (productId: string, selectedLocker: boolean) => {
    const demoProducts = getDemoProducts(settings)
    const product = demoProducts.find(p => p.id === productId)
    const totalAmount = product ? product.price + (selectedLocker ? settings.lockerPrice : 0) : 0
    
    console.log("결제 요청:", { productId, selectedLocker, totalAmount })
    alert(`결제 요청:\n상품: ${product?.name || productId}\n개인사물함: ${selectedLocker ? '포함' : '미포함'}\n총 금액: ₩${totalAmount.toLocaleString()}`)
  }

  // 명단 확인 함수 (WHL 모드용)
  const handleVerification = async (empNo: string, name: string): Promise<{
    isValid: boolean
    message: string
    validUntil?: Date
  }> => {
    // 시뮬레이션을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 데모용 로직: 특정 사번과 이름만 유효
    const validEmployees = [
      { empNo: "20251234", name: "김도윤" },
      { empNo: "20251235", name: "이영희" },
      { empNo: "20251236", name: "박철수" }
    ]
    
    const isValid = validEmployees.some(emp => 
      emp.empNo === empNo && emp.name === name
    )
    
    if (isValid) {
      return {
        isValid: true,
        message: "등록 예정 명단과 일치합니다. 5분 내 결제해 주세요.",
        validUntil: new Date(Date.now() + 5 * 60 * 1000) // 5분 후 만료
      }
    } else {
      return {
        isValid: false,
        message: "등록 예정 명단에서 확인되지 않았습니다. 회사 담당자에게 문의해 주세요."
      }
    }
  }

  // PaymentDataTable 데모 컴포넌트
  function PaymentDataTableDemo() {
    const [paymentData, setPaymentData] = React.useState([
      { id: 1, paymentDate: "10/08", paymentTime: "14:32", company: "한화건설", empNo: "1234", name: "김도윤", gender: "남" as const, membershipType: "종일권", membershipPeriod: 3, hasLocker: true, lockerPeriod: 3, price: 115500, processed: false, lockerNumber: "", memo: "" },
      { id: 2, paymentDate: "10/08", paymentTime: "14:28", company: "LG화학", empNo: "1301", name: "이수진", gender: "여" as const, membershipType: "오전권", membershipPeriod: 2, hasLocker: true, lockerPeriod: 2, price: 77000, processed: false, lockerNumber: "", memo: "" },
      { id: 3, paymentDate: "10/08", paymentTime: "14:25", company: "현대차", empNo: "1405", name: "박민수", gender: "남" as const, membershipType: "저녁권", membershipPeriod: 1, hasLocker: false, lockerPeriod: 0, price: 33000, processed: false, lockerNumber: "", memo: "" },
      { id: 4, paymentDate: "10/08", paymentTime: "14:20", company: "한화건설", empNo: "1240", name: "정하늘", gender: "여" as const, membershipType: "종일권", membershipPeriod: 3, hasLocker: true, lockerPeriod: 3, price: 115500, processed: true, lockerNumber: "A-15", memo: "1층 우측" },
      { id: 5, paymentDate: "10/08", paymentTime: "14:15", company: "SK하이닉스", empNo: "1501", name: "최지현", gender: "여" as const, membershipType: "오전권", membershipPeriod: 3, hasLocker: false, lockerPeriod: 0, price: 99000, processed: true, lockerNumber: "", memo: "사물함 미신청" },
      { id: 6, paymentDate: "10/08", paymentTime: "14:12", company: "삼성전자", empNo: "2001", name: "강민호", gender: "남" as const, membershipType: "종일권", membershipPeriod: 3, hasLocker: true, lockerPeriod: 3, price: 115500, processed: false, lockerNumber: "", memo: "" },
      { id: 7, paymentDate: "10/08", paymentTime: "14:08", company: "LG화학", empNo: "1308", name: "윤서아", gender: "여" as const, membershipType: "저녁권", membershipPeriod: 3, hasLocker: true, lockerPeriod: 3, price: 115500, processed: false, lockerNumber: "", memo: "" },
      { id: 8, paymentDate: "10/08", paymentTime: "14:05", company: "한화건설", empNo: "1245", name: "조영준", gender: "남" as const, membershipType: "오전권", membershipPeriod: 3, hasLocker: false, lockerPeriod: 0, price: 99000, processed: true, lockerNumber: "", memo: "사물함 미신청" },
    ])

    const handleProcessed = (ids: number[]) => {
      setPaymentData(prevData =>
        prevData.map(item =>
          ids.includes(item.id) ? { ...item, processed: true } : item
        )
      )
    }

    const handleToggleProcessed = (id: number) => {
      setPaymentData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, processed: !item.processed } : item
        )
      )
    }

    const handleUpdateLockerNumber = (id: number, lockerNumber: string) => {
      setPaymentData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, lockerNumber } : item
        )
      )
    }

    const handleUpdateMemo = (id: number, memo: string) => {
      setPaymentData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, memo } : item
        )
      )
    }

    return (
      <PaymentDataTable 
        data={paymentData} 
        onProcessed={handleProcessed}
        onToggleProcessed={handleToggleProcessed}
        onUpdateLockerNumber={handleUpdateLockerNumber}
        onUpdateMemo={handleUpdateMemo}
      />
    )
  }

  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <Hero
        backgroundImage="/assets/1.jpg"
        title="컴포넌트 데모"
        subtitle="GYM29 결제 시스템의 모든 컴포넌트를 확인하고 체험할 수 있습니다. 헤더, 히어로, 결제 카드 등 다양한 UI 컴포넌트를 살펴보세요."
        primaryButtonText="컴포넌트 살펴보기"
        secondaryButtonText="문서 보기"
        variant="centered"
        size="lg"
        overlay={true}
        overlayOpacity={0.5}
      />

      <div className="container mx-auto py-8 space-y-12">
        {/* 헤더 컴포넌트 데모 섹션 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Header 컴포넌트 데모</h2>
            <p className="text-muted-foreground text-lg">
              로그인/로그아웃과 마이페이지만 표시하는 심플한 헤더입니다.
            </p>
          </div>

          <div className="space-y-12">
            {/* 사용자 정보 안내 */}
            <div className="bg-accent/50 p-4 rounded-lg border border-border">
              <h4 className="font-semibold mb-2 text-accent-foreground">✨ 심플하고 깔끔한 헤더!</h4>
              <p className="text-sm text-muted-foreground">
                로고, 홈, 네비게이션 없이 오직 로그인과 마이페이지만 제공합니다. 
                사용자 이름과 계열사명이 우측에 표시되며, 클릭하면 마이페이지와 로그아웃 메뉴를 확인할 수 있습니다.
              </p>
            </div>

            {/* 로그아웃 상태 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">로그아웃 상태</h3>
              <p className="text-sm text-muted-foreground">로그인하지 않은 상태의 헤더입니다. 우측에 로그인 버튼이 표시됩니다.</p>
              <div className="border rounded-lg overflow-hidden">
                <Header
                  onLogin={handleLogin}
                  variant="default"
                />
              </div>
            </div>

            {/* 일반 사용자 로그인 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">일반 사용자 로그인</h3>
              <p className="text-sm text-muted-foreground">
                일반 사용자로 로그인한 상태입니다. 사용자 이름과 계열사명이 표시되며, 
                클릭하면 마이페이지, 로그아웃 메뉴를 확인할 수 있습니다.
              </p>
              <div className="border rounded-lg overflow-hidden">
                <Header
                  user={demoRegularUser}
                  onLogout={handleLogout}
                  variant="default"
                />
              </div>
            </div>

            {/* 고정 헤더 (Sticky) */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">고정 헤더 (Sticky)</h3>
              <p className="text-sm text-muted-foreground">페이지를 스크롤할 때 상단에 고정되는 헤더입니다. backdrop blur 효과가 적용됩니다.</p>
              <div className="border rounded-lg overflow-hidden">
                <Header
                  user={demoRegularUser}
                  onLogout={handleLogout}
                  variant="sticky"
                />
              </div>
            </div>

            {/* 투명 헤더 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">투명 헤더</h3>
              <p className="text-sm text-muted-foreground">배경이 투명한 헤더입니다. 히어로 섹션 위에 올릴 때 유용합니다.</p>
              <div className="border rounded-lg overflow-hidden bg-gradient-to-r from-primary to-secondary p-8">
                <Header
                  user={demoRegularUser}
                  onLogout={handleLogout}
                  variant="transparent"
                />
              </div>
            </div>

            {/* 사용자 메뉴 없는 헤더 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">사용자 메뉴 없는 헤더</h3>
              <p className="text-sm text-muted-foreground">사용자 메뉴가 없는 헤더입니다. 공개 페이지 등에 사용할 수 있습니다.</p>
              <div className="border rounded-lg overflow-hidden">
                <Header
                  variant="default"
                  showUserMenu={false}
                />
              </div>
            </div>

            {/* 다양한 계열사 예시 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">다양한 계열사 예시</h3>
              <p className="text-sm text-muted-foreground">
                한화 그룹의 여러 계열사 사용자들을 확인할 수 있습니다. 
                계열사명으로 소속을 명확하게 구분합니다.
              </p>
              
              <div className="space-y-3">
                {/* 한화생명 */}
                <div className="border rounded-lg overflow-hidden">
                  <Header
                    user={{
                      name: "박영희",
                      email: "younghee.park@hanwha.com",
                      companyName: "한화생명",
                      role: "user"
                    }}
                    onLogout={handleLogout}
                    variant="default"
                  />
                </div>

                {/* 한화손해보험 */}
                <div className="border rounded-lg overflow-hidden">
                  <Header
                    user={{
                      name: "최민수",
                      email: "minsu.choi@hwgeneralins.com",
                      companyName: "한화손해보험",
                      role: "user"
                    }}
                    onLogout={handleLogout}
                    variant="default"
                  />
                </div>

                {/* 한화시스템 */}
                <div className="border rounded-lg overflow-hidden">
                  <Header
                    user={{
                      name: "정서연",
                      email: "seoyeon.jung@hanwhasystems.com",
                      companyName: "한화시스템",
                      role: "user"
                    }}
                    onLogout={handleLogout}
                    variant="default"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* 히어로 컴포넌트 데모 섹션 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Hero 컴포넌트 데모</h2>
            <p className="text-muted-foreground text-lg">
              다양한 스타일과 레이아웃의 히어로 섹션을 확인할 수 있습니다.
            </p>
          </div>

          <div className="space-y-12">
            {/* 기본 히어로 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">기본 히어로 (중앙 정렬)</h3>
              <div className="border rounded-lg overflow-hidden">
                <Hero
                  backgroundImage="/assets/2.jpg"
                  title="헬스장 회원권 결제"
                  subtitle="편리하고 안전한 온라인 결제로 헬스장 회원권을 구매하세요. 다양한 이용권과 개인사물함 옵션을 제공합니다."
                  primaryButtonText="회원권 구매하기"
                  secondaryButtonText="이용안내 보기"
                  variant="centered"
                  size="lg"
                />
              </div>
            </div>

            {/* 왼쪽 정렬 히어로 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">왼쪽 정렬 히어로</h3>
              <div className="border rounded-lg overflow-hidden">
                <Hero
                  backgroundImage="/assets/3.jpg"
                  title="프리미엄 헬스장"
                  subtitle="최신 운동 기구와 전문 트레이너가 준비된 프리미엄 헬스장에서 건강한 라이프스타일을 시작하세요."
                  primaryButtonText="지금 시작하기"
                  variant="left-aligned"
                  size="md"
                />
              </div>
            </div>

            {/* 작은 히어로 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">컴팩트 히어로</h3>
              <div className="border rounded-lg overflow-hidden">
                <Hero
                  backgroundImage="/assets/4.jpg"
                  title="빠른 결제"
                  subtitle="간편한 온라인 결제 시스템"
                  primaryButtonText="결제하기"
                  variant="centered"
                  size="sm"
                />
              </div>
            </div>

            {/* 배경 없는 히어로 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">배경 없는 히어로</h3>
              <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-accent/30 to-accent/10">
                <Hero
                  title="그라디언트 배경"
                  subtitle="배경 이미지 없이도 아름다운 그라디언트 배경을 사용할 수 있습니다."
                  primaryButtonText="더 알아보기"
                  secondaryButtonText="문서 확인"
                  variant="centered"
                  size="md"
                  overlay={false}
                  className="bg-gradient-to-br from-accent/30 to-accent/10"
                  titleClassName="text-foreground"
                  subtitleClassName="text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 토스페이먼츠 결제 데모 섹션 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">토스페이먼츠 결제 데모</h2>
            <p className="text-muted-foreground text-lg">
              토스페이먼츠 SDK를 사용한 실제 결제 시스템을 체험할 수 있습니다.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 rounded-lg border-2 border-blue-200 dark:border-blue-800 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">💳 토스페이먼츠 결제 시스템</h3>
              <p className="text-blue-800 dark:text-blue-200">
                실제 결제 위젯과 결제 프로세스를 체험해보세요
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">🔧 구현된 기능</h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>결제위젯 연동</strong> - 토스페이먼츠 v2 SDK</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>카드 결제</strong> - 다양한 카드사 지원</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>결제 승인</strong> - 서버 측 결제 승인 처리</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>성공/실패 처리</strong> - 결제 결과 페이지</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>환경변수 설정</strong> - 클라이언트/시크릿 키</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">🔑 API 키 설정 방법</h4>
                <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                  <div className="p-3 bg-white/50 dark:bg-black/20 rounded border">
                    <p className="font-medium mb-2">1. 토스페이먼츠 개발자센터</p>
                    <p className="text-xs">https://developers.tosspayments.com</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-black/20 rounded border">
                    <p className="font-medium mb-2">2. API 키 발급</p>
                    <p className="text-xs">회원가입 → API 키 메뉴 → 키 확인</p>
                  </div>
                  <div className="p-3 bg-white/50 dark:bg-black/20 rounded border">
                    <p className="font-medium mb-2">3. 환경변수 설정</p>
                    <div className="text-xs font-mono bg-black/10 p-2 rounded mt-1">
                      <div>NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...</div>
                      <div>TOSS_SECRET_KEY=test_sk_...</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/payment'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  💳 결제 페이지 체험하기
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/payment/success'}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  ✅ 결제 성공 페이지
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/payment/fail'}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  ❌ 결제 실패 페이지
                </Button>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-4 text-center">
                💡 테스트 환경에서는 실제 결제가 되지 않습니다. 토스페이먼츠 테스트 계정으로 결제를 시도해보세요.
              </p>
            </div>
          </div>
        </section>

        {/* RegistrationCompleteCard 컴포넌트 데모 섹션 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">RegistrationCompleteCard 컴포넌트 데모</h2>
            <p className="text-muted-foreground text-lg">
              회원가입 완료 후 표시되는 카드 컴포넌트입니다. 100% 일치하는 UI를 구현했습니다.
            </p>
          </div>

          <div className="space-y-6">
            {/* 기본 회원가입 완료 카드 */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">회원가입 완료 카드</h3>
                <p className="text-muted-foreground">
                  대상 사이트와 100% 일치하는 회원가입 완료 페이지입니다.
                </p>
              </div>
              <div className="flex justify-center">
                <RegistrationCompleteCard
                  companyName="반트"
                  onHomeClick={() => alert("홈화면으로 이동합니다.")}
                  onParqClick={() => alert("PAR-Q 작성 페이지로 이동합니다.")}
                />
              </div>
            </div>

            {/* 다양한 계열사 예시 */}
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">다양한 계열사 예시</h3>
                <p className="text-muted-foreground">
                  계열사명을 변경하여 다양한 브랜드에 적용할 수 있습니다.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-center">한화건설</h4>
                  <RegistrationCompleteCard
                    companyName="한화건설"
                    onHomeClick={() => alert("한화건설 홈화면으로 이동합니다.")}
                    onParqClick={() => alert("PAR-Q 작성 페이지로 이동합니다.")}
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-center">한화생명</h4>
                  <RegistrationCompleteCard
                    companyName="한화생명"
                    onHomeClick={() => alert("한화생명 홈화면으로 이동합니다.")}
                    onParqClick={() => alert("PAR-Q 작성 페이지로 이동합니다.")}
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-center">한화시스템</h4>
                  <RegistrationCompleteCard
                    companyName="한화시스템"
                    onHomeClick={() => alert("한화시스템 홈화면으로 이동합니다.")}
                    onParqClick={() => alert("PAR-Q 작성 페이지로 이동합니다.")}
                  />
                </div>
              </div>
            </div>

            {/* 기능 설명 */}
            <div className="p-6 bg-muted/30 rounded-lg space-y-4">
              <h4 className="font-semibold text-lg">✨ 주요 특징</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium">🎨 디자인 특징</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>중앙 정렬:</strong> 모든 요소가 중앙에 정렬된 깔끔한 레이아웃</li>
                    <li>• <strong>아이콘:</strong> 체크 아이콘으로 성공 상태를 시각적으로 표현</li>
                    <li>• <strong>타이포그래피:</strong> 제목과 본문의 명확한 계층 구조</li>
                    <li>• <strong>버튼:</strong> Primary와 Outline 스타일로 구분된 액션 버튼</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium">🔧 기능 특징</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>커스터마이징:</strong> companyName prop으로 계열사명 변경 가능</li>
                    <li>• <strong>이벤트 핸들링:</strong> onHomeClick, onParqClick으로 버튼 동작 제어</li>
                    <li>• <strong>반응형:</strong> 모바일과 데스크톱 모두 완벽 지원</li>
                    <li>• <strong>접근성:</strong> 적절한 색상 대비와 아이콘 사용</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h5 className="font-medium mb-2">📋 사용법</h5>
                <div className="bg-background p-3 rounded border text-xs font-mono">
                  <div className="text-muted-foreground">{"<RegistrationCompleteCard"}</div>
                  <div className="ml-2">companyName=&quot;반트&quot;</div>
                  <div className="ml-2">onHomeClick={`{() => alert('홈화면으로 이동')}`}</div>
                  <div className="ml-2">onParqClick={`{() => alert('PAR-Q 작성')}`}</div>
                  <div className="text-muted-foreground">{" />"}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PaymentsCard 컴포넌트 데모 섹션 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">PaymentsCard 컴포넌트 데모</h2>
            <p className="text-muted-foreground text-lg">
              결제 카드 컴포넌트의 다양한 상태와 모드를 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-12">
            {/* FCFS 모드 - 선착순 */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">선착순 모드</h2>
                <p className="text-muted-foreground">
                  선착순 모드입니다. 명단 확인 없이 바로 결제 가능합니다.
                </p>
              </div>
              <div className="flex justify-center">
                <PaymentsCard
                  user={demoUser}
                  company={demoCompanyFCFS}
                  products={getDemoProducts(settings)}
                  agreements={getDemoAgreements(settings, demoCompanyFCFS.id)}
                  onPayment={handlePayment}
                />
              </div>
            </div>

            {/* WHL 모드 - 추첨제 */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">추첨제 모드</h2>
                <p className="text-muted-foreground">
                  추첨제 모드입니다. 명단 확인이 필요합니다.
                </p>
                <div className="text-sm text-muted-foreground mt-2 space-y-1">
                  <p>현재 사용자: 이영희 (저녁권만 등록 예정)</p>
                  <p>유효한 명단:</p>
                  <p>• 사번: 20251234, 이름: 김도윤 (종일권, 오전권 등록)</p>
                  <p>• 사번: 20251235, 이름: 이영희 (저녁권 등록)</p>
                  <p>• 사번: 20251236, 이름: 박철수 (등록 없음)</p>
                </div>
              </div>
              <div className="flex justify-center">
                <PaymentsCard
                  user={demoUserWHL}
                  company={demoCompanyWHL}
                  products={getDemoProducts(settings)}
                  agreements={getDemoAgreements(settings, demoCompanyWHL.id)}
                  onPayment={handlePayment}
                  onVerification={handleVerification}
                />
              </div>
            </div>

            {/* 마감 상태 */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">마감 상태</h2>
                <p className="text-muted-foreground">
                  모든 상품이 마감된 상태입니다.
                </p>
              </div>
              <div className="flex justify-center">
                <PaymentsCard
                  user={demoUser}
                  company={demoCompanySoldOut}
                  products={getDemoProductsSoldOut(settings)}
                  agreements={getDemoAgreements(settings, demoCompanySoldOut.id)}
                  onPayment={handlePayment}
                />
              </div>
            </div>

            {/* 기간 만료 상태 */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">기간 만료 상태</h2>
                <p className="text-muted-foreground">
                  등록 기간이 지난 상태입니다.
                </p>
              </div>
              <div className="flex justify-center">
                <PaymentsCard
                  user={demoUser}
                  company={demoCompanyExpired}
                  products={getDemoProducts(settings)}
                  agreements={getDemoAgreements(settings, demoCompanyExpired.id)}
                  onPayment={handlePayment}
                />
              </div>
            </div>

            {/* 명단 불일치 상태 */}
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-semibold">명단 불일치 상태</h2>
                <p className="text-muted-foreground">
                  사용자의 계열사 정보가 일치하지 않는 상태입니다.
                </p>
              </div>
              <div className="flex justify-center">
                <PaymentsCard
                  user={demoUserMismatch}
                  company={demoCompanyFCFS}
                  products={getDemoProducts(settings)}
                  agreements={getDemoAgreements(settings, demoCompanyFCFS.id)}
                  onPayment={handlePayment}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 전역 설정 연동 데모 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">전역 설정 연동 데모</h2>
            <p className="text-muted-foreground text-lg">
              어드민 페이지에서 설정한 가격과 상품 상태가 실시간으로 고객 결제 페이지에 반영됩니다.
            </p>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 space-y-4">
            <h3 className="text-xl font-semibold text-primary">✨ 실시간 가격 및 상품 상태 반영</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">현재 설정된 가격 및 상태</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>종일권 (월당):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₩{settings.membershipPrices.fullDay.toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded text-xs ${settings.productStatus.memberships.fullDay ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {settings.productStatus.memberships.fullDay ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>오전권 (월당):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₩{settings.membershipPrices.morning.toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded text-xs ${settings.productStatus.memberships.morning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {settings.productStatus.memberships.morning ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>저녁권 (월당):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₩{settings.membershipPrices.evening.toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded text-xs ${settings.productStatus.memberships.evening ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {settings.productStatus.memberships.evening ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>개인사물함 (월당):</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₩{settings.lockerPrice.toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded text-xs ${settings.productStatus.locker ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {settings.productStatus.locker ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">3개월 이용 시 총 금액</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>종일권 (3개월):</span>
                    <span className="font-semibold">₩{(settings.membershipPrices.fullDay * 3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>오전권 (3개월):</span>
                    <span className="font-semibold">₩{(settings.membershipPrices.morning * 3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>저녁권 (3개월):</span>
                    <span className="font-semibold">₩{(settings.membershipPrices.evening * 3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>개인사물함 (3개월):</span>
                    <span className="font-semibold">₩{settings.lockerPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-primary/20">
              <p className="text-sm text-muted-foreground">
                💡 <strong>어드민 페이지</strong>에서 가격과 상품 상태를 변경하면 이 페이지의 모든 결제 카드에서 즉시 반영됩니다. 
                비활성화된 상품은 선택할 수 없으며 "비활성" 배지가 표시됩니다.
              </p>
            </div>
          </div>
        </section>

        {/* 사용법 안내 */}
        <section className="bg-muted/50 p-6 rounded-lg space-y-4">
          <h3 className="text-xl font-semibold">컴포넌트 사용법 안내</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Header 컴포넌트</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>사용자 정보:</strong> user prop으로 로그인 상태 관리</li>
                <li>• <strong>이름 표시:</strong> user.name으로 사용자 이름 표시</li>
                <li>• <strong>계열사명:</strong> user.companyName으로 소속 계열사명 표시</li>
                <li>• <strong>레이아웃:</strong> variant로 default/transparent/sticky 선택</li>
                <li>• <strong>기능:</strong> showUserMenu로 사용자 메뉴 표시 제어</li>
                <li>• <strong>이벤트:</strong> onLogin, onLogout으로 인증 처리</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Header 컴포넌트 예시</h4>
              <div className="bg-background p-3 rounded border text-xs font-mono">
                <div className="text-muted-foreground">{"<Header"}</div>
                <div className="ml-2">user={`{{`}</div>
                <div className="ml-4">name: &quot;김도윤&quot;,</div>
                <div className="ml-4">companyName: &quot;한화건설&quot;</div>
                <div className="ml-2">{`}}`}</div>
                <div className="ml-2">onLogin={`{handleLogin}`}</div>
                <div className="ml-2">onLogout={`{handleLogout}`}</div>
                <div className="ml-2">variant=&quot;default&quot;</div>
                <div className="text-muted-foreground">{" />"}</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Hero 컴포넌트</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>배경 이미지:</strong> backgroundImage prop으로 설정</li>
                <li>• <strong>텍스트 콘텐츠:</strong> title, subtitle으로 제목과 부제목 설정</li>
                <li>• <strong>CTA 버튼:</strong> primaryButtonText, secondaryButtonText로 버튼 추가</li>
                <li>• <strong>레이아웃:</strong> variant로 중앙/왼쪽 정렬 선택</li>
                <li>• <strong>크기:</strong> size로 sm/md/lg 크기 조절</li>
                <li>• <strong>오버레이:</strong> overlay로 배경 이미지 위 오버레이 설정</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Hero 컴포넌트 예시</h4>
              <div className="bg-background p-3 rounded border text-xs font-mono">
                <div className="text-muted-foreground">{"<Hero"}</div>
                <div className="ml-2">backgroundImage=&quot;url(...)&quot;</div>
                <div className="ml-2">title=&quot;제목&quot;</div>
                <div className="ml-2">subtitle=&quot;부제목&quot;</div>
                <div className="ml-2">primaryButtonText=&quot;시작하기&quot;</div>
                <div className="ml-2">variant=&quot;centered&quot;</div>
                <div className="ml-2">size=&quot;lg&quot;</div>
                <div className="text-muted-foreground">{" />"}</div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">PaymentsCard 컴포넌트</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">선착순 모드</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 명단 확인 없이 바로 결제 가능</li>
                  <li>• 상품 선택 후 필수 동의 체크</li>
                  <li>• 결제 완료 순으로 확정</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">추첨제 모드</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 사번과 이름으로 명단 확인</li>
                  <li>• 미리 등록된 회원권만 선택 가능</li>
                  <li>• 등록 예정 명단에 없는 회원권은 비활성화</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">주요 기능</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>로그인 기반 접근 제어:</strong> 사용자의 계열사 정보와 매칭</li>
              <li>• <strong>명단 일치 확인:</strong> WHL 모드에서 사번 + 이름 검증</li>
              <li>• <strong>기간 제어:</strong> available_from ~ available_until 체크</li>
              <li>• <strong>동의서 관리:</strong> 필수 2종 + 선택 1종, 버전 로그 가능</li>
              <li>• <strong>상태 표시:</strong> 여유/임박/마감 상태 실시간 반영</li>
            </ul>
          </div>
        </section>

        {/* 로그인 폼 데모 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Login Form 데모</h2>
            <p className="text-muted-foreground text-lg">
              로그인 페이지 UI 컴포넌트입니다.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <CardContent className="space-y-6 pt-6">
                {/* 이메일 입력 */}
                <div className="space-y-2">
                  <label htmlFor="demo-email" className="text-base font-normal">
                    아이디(이메일)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      id="demo-email" 
                      type="text" 
                      placeholder="이메일을 입력해 주세요"
                      className="h-12"
                    />
                    <div className="h-12 flex items-center px-3 border rounded-md bg-muted/50 text-muted-foreground">
                      @hanwha.com
                    </div>
                  </div>
                </div>
                
                {/* 비밀번호 입력 */}
                <div className="space-y-2">
                  <label htmlFor="demo-password" className="text-base font-normal">
                    비밀번호
                  </label>
                  <div className="relative">
                    <Input 
                      id="demo-password" 
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      className="h-12"
                    />
                  </div>
                </div>
                
                {/* 로그인 버튼 */}
                <Button 
                  className="w-full h-14 text-lg font-medium bg-cyan-400 hover:bg-cyan-500 text-white"
                  size="lg"
                >
                  로그인
                </Button>
              </CardContent>
              
              <CardFooter className="justify-center pb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Link 
                    href="/forgot-password" 
                    className="hover:text-foreground transition-colors"
                  >
                    비밀번호 찾기
                  </Link>
                  <span className="text-neutral-300 dark:text-neutral-700">|</span>
                  <Link 
                    href="/signup" 
                    className="hover:text-foreground transition-colors"
                  >
                    회원가입
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="max-w-2xl mx-auto p-6 bg-muted/30 rounded-lg space-y-4">
            <h4 className="font-semibold text-lg">✨ 주요 특징</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>이메일 분리 입력:</strong> 사용자명과 도메인을 분리하여 입력</li>
              <li>• <strong>도메인 선택:</strong> @hanwha.com 등 계열사 이메일 도메인 선택 가능</li>
              <li>• <strong>비밀번호 표시/숨김:</strong> 눈 아이콘으로 비밀번호 보기 토글</li>
              <li>• <strong>깔끔한 디자인:</strong> 심플하고 현대적인 로그인 UI</li>
              <li>• <strong>반응형:</strong> 모바일/데스크톱 모두 완벽 지원</li>
              <li>• <strong>다크모드:</strong> 자동으로 다크모드 적용</li>
            </ul>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💡 실제 로그인 페이지는 <code className="px-1 py-0.5 bg-background rounded">/login</code> 경로에서 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 새로운 공통 컴포넌트 데모 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">공통 컴포넌트 데모</h2>
            <p className="text-muted-foreground text-lg">
              MVP 구현을 위한 필수 공통 컴포넌트들입니다.
            </p>
          </div>

          {/* StatusBadge 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">StatusBadge - 상태 배지</h3>
            <p className="text-muted-foreground">다양한 상태를 시각적으로 표시하는 배지 컴포넌트입니다. Primary 컬러의 농도로 차별화됩니다.</p>
            
            <div className="grid md:grid-cols-3 gap-4 p-6 bg-muted/30 rounded-lg">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">활성/비활성</h4>
                <div className="flex gap-2">
                  <StatusBadge status="active" />
                  <StatusBadge status="inactive" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">완료/대기</h4>
                <div className="flex gap-2">
                  <StatusBadge status="completed" />
                  <StatusBadge status="pending" />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">취소/오류</h4>
                <div className="flex gap-2">
                  <StatusBadge status="cancelled" />
                  <StatusBadge status="error" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <h4 className="font-medium mb-2 text-sm">커스텀 라벨</h4>
              <div className="flex gap-2">
                <StatusBadge status="active" label="진행중" />
                <StatusBadge status="inactive" label="중단됨" />
                <StatusBadge status="completed" label="결제완료" />
              </div>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg text-sm">
              <h4 className="font-medium mb-2">🎨 색상 체계</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>활성 (active):</strong> Primary 100% - 완전히 활성화된 상태</li>
                <li>• <strong>완료 (completed):</strong> Primary 80% - 작업이 완료된 상태</li>
                <li>• <strong>대기 (pending):</strong> Primary 50% - 처리 대기중인 상태</li>
                <li>• <strong>비활성 (inactive):</strong> Primary 30% - 비활성화된 상태</li>
                <li>• <strong>취소 (cancelled):</strong> Muted - 중립적인 회색</li>
                <li>• <strong>오류 (error):</strong> Destructive - 에러 전용 색상</li>
              </ul>
            </div>
          </div>

          {/* NoticeCard 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">NoticeCard - 안내 카드</h3>
            <p className="text-muted-foreground">결제 불가 시 표시되는 안내 카드 컴포넌트입니다. Primary 컬러 농도로 중요도를 표현합니다.</p>
            
            <div className="space-y-4">
              <NoticeCard
                type="error"
                title="등록 불가"
                message="현재는 등록 기간이 아닙니다"
                subtitle="다음 등록 기간에 참여해 주세요"
              />
              
              <NoticeCard
                type="warning"
                title="마감 임박"
                message="남은 자리가 5개 미만입니다"
                subtitle="서둘러 등록해주세요"
              />
              
              <NoticeCard
                type="info"
                title="등록 기간 안내"
                message="2025-10-07 ~ 2025-10-11"
                subtitle="해당 기간에만 등록이 가능합니다"
              />
              
              <NoticeCard
                type="success"
                title="결제 완료"
                message="결제가 성공적으로 완료되었습니다"
                subtitle="이메일로 영수증이 발송되었습니다"
              />
            </div>

            <div className="p-4 bg-muted/20 rounded-lg text-sm">
              <h4 className="font-medium mb-2">🎨 색상 농도</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• <strong>Success:</strong> Primary 20% 배경 - 가장 진한 강조</li>
                <li>• <strong>Warning:</strong> Primary 10% 배경 - 중간 강조</li>
                <li>• <strong>Info:</strong> Primary 5% 배경 - 약한 강조</li>
                <li>• <strong>Error:</strong> Destructive 5% 배경 - 에러 전용</li>
              </ul>
            </div>
          </div>

          {/* DataTable 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">DataTable - 일반 데이터 테이블</h3>
            <p className="text-muted-foreground">범용 엑셀 스타일의 데이터 테이블 컴포넌트입니다.</p>
            
            <DataTable
              columns={[
                { key: "id", header: "No", width: "60px" },
                { key: "company", header: "계열사", width: "100px" },
                { key: "name", header: "이름", width: "80px" },
                { key: "membershipType", header: "회원권", width: "80px" },
                { 
                  key: "status", 
                  header: "상태",
                  width: "100px",
                  render: (row) => (
                    <StatusBadge 
                      status={row.status === "completed" ? "completed" : "pending"} 
                    />
                  )
                },
                { 
                  key: "price", 
                  header: "금액",
                  width: "100px",
                  render: (row) => row.price.toLocaleString()
                }
              ]}
              data={[
                { id: 1, company: "한화건설", name: "김도윤", membershipType: "종일권", status: "completed", price: 115500 },
                { id: 2, company: "LG화학", name: "이수진", membershipType: "오전권", status: "completed", price: 77000 },
                { id: 3, company: "현대차", name: "박민수", membershipType: "저녁권", status: "completed", price: 33000 },
                { id: 4, company: "삼성전자", name: "최지현", membershipType: "종일권", status: "completed", price: 99000 },
                { id: 5, company: "SK하이닉스", name: "정하늘", membershipType: "오전권", status: "completed", price: 99000 }
              ]}
              searchable={true}
              searchPlaceholder="계열사, 이름으로 검색..."
              onRowClick={(row) => alert(`${row.name}님의 결제 정보\n계열사: ${row.company}\n금액: ${row.price.toLocaleString()}`)}
            />
          </div>

          {/* PaymentDataTable 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">PaymentDataTable - 결제 내역 전용 테이블</h3>
            <p className="text-muted-foreground">
              결제 내역을 확인하고 입장 프로그램 등록 후 처리 완료를 체크하는 전용 테이블입니다.
            </p>
            
            <PaymentDataTableDemo />
          </div>

          {/* PageHeader 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">PageHeader - 페이지 헤더</h3>
            <p className="text-muted-foreground">페이지 상단 헤더 컴포넌트입니다.</p>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <PageHeader
                  title="계열사 관리"
                  description="계열사 정보를 관리하고 할당량을 설정합니다"
                  action={
                    <>
                      <Button variant="outline">엑셀 받기</Button>
                      <Button>+ 계열사 추가</Button>
                    </>
                  }
                />
              </div>
              
              <div className="p-4 border rounded-lg">
                <PageHeader
                  title="결제 내역"
                  action={
                    <Button variant="outline">엑셀 다운로드</Button>
                  }
                />
              </div>
            </div>
          </div>

          {/* CompanyForm 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">CompanyForm - 계열사 폼</h3>
            <p className="text-muted-foreground">계열사 추가/수정 폼 컴포넌트입니다. (버튼 클릭하여 확인)</p>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  // 실제 사용 시에는 state로 관리
                  alert("CompanyForm 모달이 열립니다 (실제 구현 시 Dialog로 표시)")
                }}
              >
                계열사 추가 모달 열기
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  alert("CompanyForm 편집 모드로 열립니다")
                }}
              >
                계열사 수정 모달 열기
              </Button>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-lg text-sm space-y-2">
              <p className="font-medium">포함된 기능:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>계열사 ID, 이름 입력</li>
                <li>회원권별 할당량 설정 (종일/오전/저녁)</li>
                <li>모드 선택 (선착순/추첨제)</li>
                <li>전역 설정 기간 표시 (읽기 전용)</li>
                <li>활성화 상태 토글</li>
                <li>유효성 검사 및 자동 합계 계산</li>
              </ul>
            </div>
          </div>

          {/* AdminSidebar 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">AdminSidebar - 어드민 사이드바</h3>
            <p className="text-muted-foreground">어드민 페이지의 네비게이션 사이드바입니다.</p>
            
            <div className="p-6 bg-muted/30 rounded-lg">
              <div className="w-64 h-96 border rounded-lg overflow-hidden">
                <AdminSidebar />
              </div>
            </div>
          </div>

          {/* AdminLayout 데모 안내 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">AdminLayout - 어드민 레이아웃</h3>
            <p className="text-muted-foreground">어드민 페이지의 전체 레이아웃 컴포넌트입니다.</p>
            
            <div className="p-6 bg-muted/30 rounded-lg space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">포함된 요소:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>사이드바 네비게이션 (대시보드, 전역 설정, 계열사 관리, 결제 내역, 사용자 관리, 통계 보고서)</li>
                  <li>관리자 정보 표시</li>
                  <li>모바일 반응형 메뉴</li>
                  <li>활성 메뉴 하이라이트</li>
                  <li>로그아웃 버튼</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  💡 실제 어드민 페이지에서 사용됩니다. <code className="px-1 py-0.5 bg-background rounded">AdminLayout</code>로 페이지를 감싸서 사용하세요.
                </p>
              </div>
            </div>
          </div>

          {/* AgreementModal 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">AgreementModal - 동의서 모달</h3>
            <p className="text-muted-foreground">동의서 내용을 표시하고 동의를 받는 모달 컴포넌트입니다.</p>
            
            <div className="p-6 bg-muted/30 rounded-lg space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">기능:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>동의서 내용 스크롤 가능한 모달로 표시</li>
                  <li>필수/선택 동의서 구분</li>
                  <li>버전 정보 표시</li>
                  <li>동의 체크박스 및 버튼</li>
                  <li>동의 상태에 따른 버튼 활성화/비활성화</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">📋 기본 동의서</h4>
                <div className="flex gap-2 flex-wrap">
                  {AGREEMENTS.filter(agreement => 
                    ['service', 'privacy', 'marketing', 'sensitive', 'utilization'].includes(agreement.type)
                  ).map((agreement) => (
                    <Button
                      key={agreement.type}
                      variant="outline"
                      onClick={() => {
                        setSelectedAgreement(agreement)
                        setAgreementModalOpen(true)
                      }}
                    >
                      {agreement.title}
                    </Button>
                  ))}
                </div>
                
                <h4 className="font-medium">🏥 SHP 스마트헬스플랫폼 동의서</h4>
                <div className="flex gap-2 flex-wrap">
                  {AGREEMENTS.filter(agreement => 
                    ['shp', 'shp-data'].includes(agreement.type)
                  ).map((agreement) => (
                    <Button
                      key={agreement.type}
                      variant="outline"
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedAgreement(agreement)
                        setAgreementModalOpen(true)
                      }}
                    >
                      {agreement.title}
                    </Button>
                  ))}
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🏥 SHP 스마트헬스플랫폼 동의서 특징</h5>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• <strong>실시간 건강 모니터링:</strong> 웨어러블 디바이스를 통한 생체신호 수집</li>
                    <li>• <strong>AI 기반 분석:</strong> 개인별 맞춤 운동 프로그램 및 건강 조언 제공</li>
                    <li>• <strong>응급상황 대응:</strong> 이상 징후 감지 시 자동 알림 및 의료진 연계</li>
                    <li>• <strong>원격 상담:</strong> 의료진과의 화상 상담 서비스 제공</li>
                    <li>• <strong>데이터 보안:</strong> 건강데이터 전용 보안 시스템 및 암호화</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* AgreementList 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">AgreementList - 동의서 목록</h3>
            <p className="text-muted-foreground">동의서 목록을 표시하고 동의 상태를 확인할 수 있는 컴포넌트입니다.</p>
            
            <div className="p-6 bg-muted/30 rounded-lg">
              <AgreementList
                agreements={AGREEMENTS}
                onAgreementClick={(agreement) => {
                  setSelectedAgreement(agreement)
                  setAgreementModalOpen(true)
                }}
                agreedStatus={agreedStatus}
              />
            </div>
          </div>

          {/* SHP 개인정보처리방침 관리 시스템 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">SHP 개인정보처리방침 관리 시스템</h3>
            <p className="text-muted-foreground">크롤링된 SHP 개인정보처리방침 데이터를 엑셀 스타일로 관리하는 시스템입니다.</p>
            
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-4">🏥 SHP 개인정보처리방침 관리 특징</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>• <strong>크롤링된 실제 데이터</strong>: SHP 웹사이트에서 크롤링한 개인정보처리방침 정보</li>
                <li>• <strong>엑셀 스타일 테이블</strong>: 직관적이고 단순한 테이블 형태의 UI</li>
                <li>• <strong>실시간 편집</strong>: 항목 수정 시 즉시 홈페이지에 반영</li>
                <li>• <strong>카테고리별 관리</strong>: 개인정보 수집목적, 수집항목, 제3자 제공 등으로 분류</li>
                <li>• <strong>회사별 설정</strong>: 각 회사별로 활성화/필수 항목 개별 설정</li>
                <li>• <strong>법적 준수</strong>: 개인정보보호법, 전자서명법 등 관련 법령 준수</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <ExcelStyleAgreementManager />
            </div>
          </div>

          {/* 동의서 편집 데모 */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">동의서 편집 데모</h3>
            <p className="text-muted-foreground">관리자가 동의서 내용을 편집할 수 있는 기능을 시연합니다.</p>
            
            <div className="p-6 bg-muted/30 rounded-lg space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">편집 가능한 동의서:</h4>
                <div className="flex gap-2 flex-wrap">
                  {AGREEMENTS.map((agreement) => (
                    <Button
                      key={`edit-${agreement.type}`}
                      variant="secondary"
                      onClick={() => {
                        setEditingAgreement(agreement)
                        setEditModalOpen(true)
                      }}
                    >
                      {agreement.title} 편집
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  💡 실제 관리자 페이지에서는 동의서 내용을 실시간으로 편집하고 미리보기할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 엑셀 업로드 및 결제 상태 확인 데모 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">엑셀 업로드 및 결제 상태 확인 데모</h2>
            <p className="text-muted-foreground text-lg">
              명단 업로드와 결제 여부 확인 기능을 체험할 수 있습니다.
            </p>
          </div>

          <div className="space-y-6">
            {/* ExcelUploadModal 데모 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">ExcelUploadModal - 명단 업로드</h3>
              <p className="text-muted-foreground">
                엑셀 파일로 직원 명단을 업로드하여 결제 상태를 확인할 수 있습니다.
              </p>
              
              <div className="p-6 bg-muted/30 rounded-lg space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">주요 기능:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>엑셀 파일(.xlsx, .xls) 업로드</li>
                    <li>템플릿 다운로드 기능</li>
                    <li>업로드된 명단 미리보기</li>
                    <li>필수 컬럼 검증 (사번, 이름)</li>
                    <li>명단 데이터 처리 및 전달</li>
                  </ul>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => setShowExcelUpload(true)}>
                    명단 업로드 모달 열기
                  </Button>
                </div>
              </div>
            </div>

            {/* PaymentStatusTable 데모 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">PaymentStatusTable - 결제 상태 확인</h3>
              <p className="text-muted-foreground">
                업로드된 명단과 실제 결제 내역을 비교하여 결제 상태를 테이블로 표시합니다.
              </p>
              
              <div className="p-6 bg-muted/30 rounded-lg space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">주요 기능:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>결제 상태 통계 (전체, 결제완료, 미결제, 결제율)</li>
                    <li>명단과 결제내역 자동 매칭</li>
                    <li>결제 상태별 필터링 및 정렬</li>
                    <li>엑셀 내보내기 기능</li>
                    <li>실시간 데이터 새로고침</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">데모 데이터로 체험하기:</h4>
                  <Button 
                    onClick={() => {
                      // 데모 데이터 생성
                      const demoData = [
                        {
                          member: { 사번: "EMP001", 이름: "김도윤", 부서: "개발팀", 이메일: "doyun@company.com", 연락처: "010-1234-5678" },
                          payment: {
                            id: "1",
                            payment_date: "2025-01-15",
                            company: "한화건설",
                            employee_id: "EMP001",
                            name: "김도윤",
                            gender: "남" as const,
                            membership_type: "종일권",
                            membership_period: 3,
                            has_locker: true,
                            locker_period: 3,
                            locker_number: "A-15",
                            price: 115500,
                            status: "completed",
                            processed: true,
                            memo: "처리완료",
                            toss_payment_key: "test_key_1",
                            toss_order_id: "test_order_1",
                            created_at: "2025-01-15T10:00:00Z",
                            updated_at: "2025-01-15T10:00:00Z"
                          },
                          status: "paid" as const,
                          lastPaymentDate: "2025-01-15",
                          totalAmount: 115500
                        },
                        {
                          member: { 사번: "EMP002", 이름: "이영희", 부서: "마케팅팀", 이메일: "younghee@company.com", 연락처: "010-2345-6789" },
                          payment: {
                            id: "2",
                            payment_date: "2025-01-14",
                            company: "한화건설",
                            employee_id: "EMP002",
                            name: "이영희",
                            gender: "여" as const,
                            membership_type: "오전권",
                            membership_period: 3,
                            has_locker: false,
                            locker_period: 0,
                            price: 99000,
                            status: "completed",
                            processed: true,
                            memo: "처리완료",
                            toss_payment_key: "test_key_2",
                            toss_order_id: "test_order_2",
                            created_at: "2025-01-14T14:30:00Z",
                            updated_at: "2025-01-14T14:30:00Z"
                          },
                          status: "paid" as const,
                          lastPaymentDate: "2025-01-14",
                          totalAmount: 99000
                        },
                        {
                          member: { 사번: "EMP003", 이름: "박철수", 부서: "영업팀", 이메일: "chulsoo@company.com", 연락처: "010-3456-7890" },
                          status: "unpaid" as const
                        },
                        {
                          member: { 사번: "EMP004", 이름: "정하늘", 부서: "인사팀", 이메일: "haneul@company.com", 연락처: "010-4567-8901" },
                          payment: {
                            id: "3",
                            payment_date: "2025-01-13",
                            company: "한화건설",
                            employee_id: "EMP004",
                            name: "정하늘",
                            gender: "여" as const,
                            membership_type: "저녁권",
                            membership_period: 1,
                            has_locker: true,
                            locker_period: 1,
                            locker_number: "B-20",
                            price: 33000,
                            status: "pending",
                            processed: false,
                            memo: "처리대기",
                            toss_payment_key: "test_key_3",
                            toss_order_id: "test_order_3",
                            created_at: "2025-01-13T16:45:00Z",
                            updated_at: "2025-01-13T16:45:00Z"
                          },
                          status: "partial" as const,
                          lastPaymentDate: "2025-01-13",
                          totalAmount: 33000
                        }
                      ]
                      setPaymentStatusData(demoData)
                    }}
                  >
                    데모 데이터로 체험하기
                  </Button>
                  
                  {paymentStatusData.length > 0 && (
                    <PaymentStatusTable
                      data={paymentStatusData}
                      onRefresh={() => console.log("새로고침")}
                      loading={false}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 통합 결제내역관리 데모 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">통합 결제내역관리 시스템</h3>
              <p className="text-muted-foreground">
                결제내역관리 페이지에서 명단 업로드와 결제 상태 확인 기능이 통합되어 있습니다.
              </p>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-6 rounded-lg border-2 border-green-200 dark:border-green-800 space-y-4">
                <div className="text-center space-y-2">
                  <h4 className="text-xl font-bold text-green-900 dark:text-green-100">✨ 통합 관리 시스템</h4>
                  <p className="text-green-800 dark:text-green-200">
                    결제내역관리 페이지에서 모든 기능을 한 번에 사용할 수 있습니다
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-semibold text-green-900 dark:text-green-100">📊 주요 기능</h5>
                    <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                      <li>• <strong>탭 기반 네비게이션</strong> - 결제내역과 결제상태 확인</li>
                      <li>• <strong>명단 업로드</strong> - 엑셀 파일로 직원 명단 관리</li>
                      <li>• <strong>결제 상태 확인</strong> - 명단과 결제내역 자동 매칭</li>
                      <li>• <strong>통계 대시보드</strong> - 결제율, 미결제자 현황</li>
                      <li>• <strong>엑셀 내보내기</strong> - 결과 데이터 다운로드</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-semibold text-green-900 dark:text-green-100">🎯 사용 시나리오</h5>
                    <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                      <li>1. <strong>명단 업로드</strong> - 회사 직원 명단 엑셀 업로드</li>
                      <li>2. <strong>결제 상태 확인</strong> - 업로드된 명단과 결제내역 비교</li>
                      <li>3. <strong>미결제자 관리</strong> - 결제하지 않은 직원 확인</li>
                      <li>4. <strong>결과 내보내기</strong> - 관리자에게 보고서 제공</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-green-200 dark:border-green-800 text-center">
                  <Button 
                    size="lg"
                    onClick={() => window.location.href = '/admin/payments'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    💳 결제내역관리 페이지 열기
                  </Button>
                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                    💡 실제 결제내역관리 페이지에서 명단 업로드와 결제 상태 확인 기능을 체험할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 계열사별 대조 데모 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">계열사별 대조 시스템</h3>
              <p className="text-muted-foreground">
                통합관리자의 계열사 현황 데이터를 활용하여 등록자/명단과 결제내역을 대조할 수 있습니다.
              </p>
              
              <div className="p-6 bg-muted/30 rounded-lg space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">주요 기능:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>계열사별 등록자/명단과 결제내역 자동 매칭</li>
                    <li>FCFS 모드: 등록한 사람들의 결제 여부 확인</li>
                    <li>WHL 모드: 업로드된 명단의 결제 여부 확인</li>
                    <li>실시간 통계 및 결제율 계산</li>
                    <li>엑셀 내보내기로 보고서 생성</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">데모 데이터로 체험하기:</h4>
                  <CompanyComparisonTable
                    companies={[
                      {
                        id: "B01",
                        name: "한화건설",
                        code: "H01",
                        mode: "FCFS",
                        membershipQuota: {
                          allDay: { assigned: 20, registered: 15, hasList: false },
                          morning: { assigned: 21, registered: 12, hasList: false },
                          evening: { assigned: 41, registered: 11, hasList: false }
                        },
                        status: "active",
                        availableFrom: "2025-10-07",
                        availableUntil: "2025-10-11"
                      },
                      {
                        id: "B02", 
                        name: "LG화학",
                        code: "H02",
                        mode: "WHL",
                        membershipQuota: {
                          allDay: { assigned: 45, registered: 0, hasList: true },
                          morning: { assigned: 8, registered: 0, hasList: true },
                          evening: { assigned: 18, registered: 0, hasList: true }
                        },
                        status: "active",
                        availableFrom: "2025-10-07",
                        availableUntil: "2025-10-11"
                      },
                      {
                        id: "B03",
                        name: "삼성전자", 
                        code: "H03",
                        mode: "FCFS",
                        membershipQuota: {
                          allDay: { assigned: 20, registered: 20, hasList: false },
                          morning: { assigned: 0, registered: 0, hasList: false },
                          evening: { assigned: 0, registered: 0, hasList: false }
                        },
                        status: "active",
                        availableFrom: "2025-10-07",
                        availableUntil: "2025-10-11"
                      }
                    ]}
                    registrations={[
                      {
                        id: "R001",
                        company_id: "B01",
                        employee_id: "EMP001",
                        name: "김도윤",
                        email: "doyun@hanwha.com",
                        phone: "010-1234-5678",
                        department: "개발팀",
                        registered_at: "2025-01-10T09:00:00Z",
                        membership_type: "종일권",
                        membership_period: 3
                      },
                      {
                        id: "R002",
                        company_id: "B01", 
                        employee_id: "EMP002",
                        name: "이영희",
                        email: "younghee@hanwha.com",
                        phone: "010-2345-6789",
                        department: "마케팅팀",
                        registered_at: "2025-01-10T10:30:00Z",
                        membership_type: "오전권",
                        membership_period: 3
                      },
                      {
                        id: "R003",
                        company_id: "B01",
                        employee_id: "EMP003", 
                        name: "박철수",
                        email: "chulsoo@hanwha.com",
                        phone: "010-3456-7890",
                        department: "영업팀",
                        registered_at: "2025-01-11T14:15:00Z",
                        membership_type: "저녁권",
                        membership_period: 1
                      },
                      {
                        id: "R004",
                        company_id: "B01",
                        employee_id: "EMP004",
                        name: "정하늘", 
                        email: "haneul@hanwha.com",
                        phone: "010-4567-8901",
                        department: "인사팀",
                        registered_at: "2025-01-11T16:45:00Z",
                        membership_type: "종일권",
                        membership_period: 3
                      }
                    ]}
                    payments={[
                      {
                        id: "P001",
                        payment_date: "2025-01-15",
                        company: "한화건설",
                        employee_id: "EMP001",
                        name: "김도윤",
                        gender: "남" as const,
                        membership_type: "종일권",
                        membership_period: 3,
                        has_locker: true,
                        locker_period: 3,
                        locker_number: "A-15",
                        price: 115500,
                        status: "completed",
                        processed: true,
                        memo: "처리완료",
                        toss_payment_key: "test_key_1",
                        toss_order_id: "test_order_1",
                        created_at: "2025-01-15T10:00:00Z",
                        updated_at: "2025-01-15T10:00:00Z"
                      },
                      {
                        id: "P002",
                        payment_date: "2025-01-14",
                        company: "한화건설",
                        employee_id: "EMP002",
                        name: "이영희",
                        gender: "여" as const,
                        membership_type: "오전권",
                        membership_period: 3,
                        has_locker: false,
                        locker_period: 0,
                        price: 99000,
                        status: "completed",
                        processed: true,
                        memo: "처리완료",
                        toss_payment_key: "test_key_2",
                        toss_order_id: "test_order_2",
                        created_at: "2025-01-14T14:30:00Z",
                        updated_at: "2025-01-14T14:30:00Z"
                      },
                      {
                        id: "P003",
                        payment_date: "2025-01-13",
                        company: "한화건설",
                        employee_id: "EMP003",
                        name: "박철수",
                        gender: "남" as const,
                        membership_type: "저녁권",
                        membership_period: 1,
                        has_locker: true,
                        locker_period: 1,
                        locker_number: "B-20",
                        price: 33000,
                        status: "pending",
                        processed: false,
                        memo: "처리대기",
                        toss_payment_key: "test_key_3",
                        toss_order_id: "test_order_3",
                        created_at: "2025-01-13T16:45:00Z",
                        updated_at: "2025-01-13T16:45:00Z"
                      }
                    ]}
                    onRefresh={() => console.log("새로고침")}
                    loading={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 대시보드 페이지 안내 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">📊 대시보드 페이지</h2>
            <p className="text-muted-foreground text-lg">
              실시간 현황과 통계를 한눈에 확인할 수 있는 대시보드입니다.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8 rounded-lg border-2 border-blue-200 dark:border-blue-800 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">📊 실시간 대시보드</h3>
              <p className="text-blue-800 dark:text-blue-200">
                통계와 현황을 실시간으로 모니터링할 수 있습니다
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">📈 주요 기능</h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>실시간 통계</strong> - 결제 건수, 금액, 계열사 현황</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>일일/주간 분석</strong> - 오늘과 이번 주 결제 현황</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>계열사별 현황</strong> - 등록률과 잔여 수 실시간 표시</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>최근 결제 내역</strong> - 최신 결제 정보 미리보기</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>실시간 연결 상태</strong> - 데이터 동기화 상태 표시</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">🎨 UI 특징</h4>
                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>카드형 레이아웃</strong> - 정보를 카드로 구분하여 가독성 향상</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>진행률 표시</strong> - 계열사별 등록률을 시각적으로 표현</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>색상 코딩</strong> - 여유/임박/마감 상태를 색상으로 구분</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>반응형 디자인</strong> - 모바일과 데스크톱 모두 최적화</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>실시간 업데이트</strong> - 새로고침 없이 자동 데이터 갱신</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-blue-200 dark:border-blue-800">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/admin/dashboard'}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  📊 대시보드 페이지 열기
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = '/admin'}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  ⚙️ 통합 관리자 페이지
                </Button>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-4 text-center">
                💡 대시보드는 통계와 현황 확인에 특화되어 있으며, 상세 관리 기능은 통합 관리자 페이지에서 이용할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 통합 관리자 페이지 안내 */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">🎯 통합 관리자 페이지</h2>
            <p className="text-muted-foreground text-lg">
              모든 관리 기능이 하나의 페이지에 통합되어 있습니다.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg border-2 border-primary/20 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">✨ 단일 페이지 통합 관리</h3>
              <p className="text-muted-foreground">
                탭 없이 스크롤로 모든 기능에 접근할 수 있습니다.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background p-6 rounded-lg space-y-4">
                <h4 className="font-semibold text-lg">📊 주요 기능</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span><strong>실시간 대시보드</strong> - KPI 카드로 한눈에 현황 파악</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span><strong>계열사 등록 현황</strong> - 바둑판 형식 테이블로 상세 현황 확인</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span><strong>등록 방식 관리</strong> - 선착순/추첨 방식 설정 및 명단 업로드</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span><strong>결제 내역 관리</strong> - 필터링, 검색, 처리 완료 체크</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">5.</span>
                    <span><strong>전역 설정</strong> - 가격, 기간, 시스템 설정 통합 관리</span>
                  </li>
                </ul>
              </div>

              <div className="bg-background p-6 rounded-lg space-y-4">
                <h4 className="font-semibold text-lg">🎨 PRD 구현 사항</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>선착순 로직</strong> - quota 기반 실시간 잔여 수 표시</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>추첨 로직</strong> - 엑셀 명단 업로드 및 검증</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>상태 관리</strong> - 여유/임박/마감 자동 계산</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>공통 컴포넌트</strong> - 재사용 가능한 모듈화</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>타입 안전성</strong> - TypeScript로 버그 방지</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-primary/20 text-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/admin'}
              >
                통합 관리자 페이지 열기 →
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                모든 관리 기능을 한 페이지에서 확인하세요
              </p>
            </div>
          </div>

          {/* 비즈니스 로직 설명 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 space-y-3">
              <h4 className="font-semibold text-lg text-blue-900 dark:text-blue-100">🔵 선착순 (FCFS)</h4>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">결제창 표시 조건:</p>
                <ul className="space-y-1 ml-4">
                  <li>✓ 계열사가 활성화 상태</li>
                  <li>✓ 현재 등록 수 &lt; 할당량</li>
                </ul>
                <p className="font-medium mt-3">상태 표시:</p>
                <ul className="space-y-1 ml-4">
                  <li>• 여유: 70% 미만</li>
                  <li>• 임박: 70~99%</li>
                  <li>• 마감: 100% 이상</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800 space-y-3">
              <h4 className="font-semibold text-lg text-purple-900 dark:text-purple-100">🟣 추첨 (WHL)</h4>
              <div className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                <p className="font-medium">결제창 표시 조건:</p>
                <ul className="space-y-1 ml-4">
                  <li>✓ 계열사가 활성화 상태</li>
                  <li>✓ 업로드된 명단에 포함</li>
                  <li>✓ 사번 + 이름 일치</li>
                </ul>
                <p className="font-medium mt-3">명단 관리:</p>
                <ul className="space-y-1 ml-4">
                  <li>• 엑셀 파일 업로드</li>
                  <li>• 사번, 이름 검증</li>
                  <li>• 일치 시 결제 가능</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 구현 파일 안내 */}
          <div className="p-6 bg-muted/30 rounded-lg space-y-4">
            <h4 className="font-semibold text-lg">📁 구현 파일 구조</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p className="font-medium text-primary">메인 페이지</p>
                <code className="block p-2 bg-background rounded text-xs">
                  src/app/admin/page.tsx
                </code>
                <p className="text-muted-foreground text-xs">
                  통합 관리자 페이지 메인 파일
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-primary">비즈니스 로직</p>
                <code className="block p-2 bg-background rounded text-xs">
                  src/lib/registration-logic.ts
                </code>
                <p className="text-muted-foreground text-xs">
                  선착순/추첨 로직 및 상태 계산
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-primary">전역 설정</p>
                <code className="block p-2 bg-background rounded text-xs">
                  src/contexts/SettingsContext.tsx
                </code>
                <p className="text-muted-foreground text-xs">
                  가격, 기간 등 전역 설정 관리
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-primary">PRD 문서</p>
                <code className="block p-2 bg-background rounded text-xs">
                  docs/GYM29-PRD-Implementation.md
                </code>
                <p className="text-muted-foreground text-xs">
                  상세한 구현 가이드 및 설명
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 동의서 모달 */}
      {selectedAgreement && (
        <AgreementModal
          agreement={selectedAgreement}
          open={agreementModalOpen}
          onOpenChange={setAgreementModalOpen}
          onAgree={(agreed) => {
            if (selectedAgreement && agreed) {
              setAgreedStatus(prev => ({
                ...prev,
                [selectedAgreement.type]: true
              }))
            }
          }}
          initialAgreed={agreedStatus[selectedAgreement.type]}
        />
      )}

      {/* 엑셀 업로드 모달 */}
      <ExcelUploadModal
        open={showExcelUpload}
        onOpenChange={setShowExcelUpload}
        onUpload={(members) => {
          console.log("업로드된 명단:", members)
          setShowExcelUpload(false)
          alert(`${members.length}명의 명단이 업로드되었습니다.`)
        }}
      />

      {/* 동의서 편집 모달 */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>동의서 편집</DialogTitle>
            <DialogDescription>
              {editingAgreement?.title} 내용을 편집할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          
          {editingAgreement && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">제목</label>
                <input
                  type="text"
                  value={editingAgreement.title}
                  className="w-full p-2 border rounded-md"
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">버전</label>
                <input
                  type="text"
                  value={editingAgreement.version}
                  className="w-full p-2 border rounded-md"
                  readOnly
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">내용</label>
                <textarea
                  value={editingAgreement.content}
                  className="w-full h-96 p-2 border rounded-md font-mono text-sm"
                  readOnly
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  닫기
                </Button>
                <Button onClick={() => setEditModalOpen(false)}>
                  저장 (데모)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 스마트 대시보드 데모 */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">스마트 대시보드 시스템</h3>
        <p className="text-muted-foreground">
          카드형 인터페이스로 계열사 현황을 직관적으로 파악하고, 클릭으로 상세 정보를 확인할 수 있는 고급 대시보드입니다.
        </p>
        <div className="p-6 bg-muted/30 rounded-lg space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">주요 기능:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>카드형 계열사 현황 - 한눈에 파악 가능</li>
              <li>회원권별 진행률 바 - 시각적 진행률 표시</li>
              <li>클릭으로 상세 모달 - 개별 결제내역 확인</li>
              <li>다중 필터링 - 회원권별, 결제상태별, 사물함별</li>
              <li>실시간 정렬 - 이름, 결제일, 금액, 부서순</li>
              <li>엑셀 내보내기 - 필터링된 결과 다운로드</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">데모 데이터로 체험하기:</h4>
            <SmartCompanyDashboard
              companies={[
                {
                  id: "B01",
                  name: "한화건설",
                  code: "H01",
                  mode: "FCFS",
                  membershipQuota: {
                    allDay: { assigned: 20, registered: 15, hasList: false },
                    morning: { assigned: 21, registered: 12, hasList: false },
                    evening: { assigned: 41, registered: 11, hasList: false }
                  },
                  status: "active",
                  availableFrom: "2025-10-07",
                  availableUntil: "2025-10-11"
                },
                {
                  id: "B02", 
                  name: "LG화학",
                  code: "H02",
                  mode: "WHL",
                  membershipQuota: {
                    allDay: { assigned: 45, registered: 0, hasList: true },
                    morning: { assigned: 8, registered: 0, hasList: true },
                    evening: { assigned: 18, registered: 0, hasList: true }
                  },
                  status: "active",
                  availableFrom: "2025-10-07",
                  availableUntil: "2025-10-11"
                },
                {
                  id: "B03",
                  name: "삼성전자", 
                  code: "H03",
                  mode: "FCFS",
                  membershipQuota: {
                    allDay: { assigned: 20, registered: 20, hasList: false },
                    morning: { assigned: 0, registered: 0, hasList: false },
                    evening: { assigned: 0, registered: 0, hasList: false }
                  },
                  status: "active",
                  availableFrom: "2025-10-07",
                  availableUntil: "2025-10-11"
                }
              ]}
              registrations={[
                {
                  id: "R001",
                  company_id: "B01",
                  employee_id: "EMP001",
                  name: "김도윤",
                  email: "doyun@hanwha.com",
                  phone: "010-1234-5678",
                  department: "개발팀",
                  registered_at: "2025-01-10T09:00:00Z",
                  membership_type: "종일권",
                  membership_period: 3
                },
                {
                  id: "R002",
                  company_id: "B01", 
                  employee_id: "EMP002",
                  name: "이영희",
                  email: "younghee@hanwha.com",
                  phone: "010-2345-6789",
                  department: "마케팅팀",
                  registered_at: "2025-01-10T10:30:00Z",
                  membership_type: "오전권",
                  membership_period: 3
                },
                {
                  id: "R003",
                  company_id: "B01",
                  employee_id: "EMP003", 
                  name: "박철수",
                  email: "chulsoo@hanwha.com",
                  phone: "010-3456-7890",
                  department: "영업팀",
                  registered_at: "2025-01-11T14:15:00Z",
                  membership_type: "저녁권",
                  membership_period: 1
                },
                {
                  id: "R004",
                  company_id: "B01",
                  employee_id: "EMP004",
                  name: "정하늘", 
                  email: "haneul@hanwha.com",
                  phone: "010-4567-8901",
                  department: "인사팀",
                  registered_at: "2025-01-11T16:45:00Z",
                  membership_type: "종일권",
                  membership_period: 3
                }
              ]}
              payments={[
                { id: "P001", payment_date: "2025-01-15", company: "한화건설", employee_id: "EMP001", name: "김도윤", gender: "남", membership_type: "종일권", membership_period: 3, has_locker: true, locker_period: 3, locker_number: "A-15", price: 115500, status: "completed", processed: true, memo: "처리완료", toss_payment_key: "test_key_1", toss_order_id: "test_order_1", created_at: "2025-01-15T10:00:00Z", updated_at: "2025-01-15T10:00:00Z" },
                { id: "P002", payment_date: "2025-01-14", company: "한화건설", employee_id: "EMP002", name: "이영희", gender: "여", membership_type: "오전권", membership_period: 3, has_locker: false, locker_period: 0, price: 99000, status: "completed", processed: true, memo: "처리완료", toss_payment_key: "test_key_2", toss_order_id: "test_order_2", created_at: "2025-01-14T14:30:00Z", updated_at: "2025-01-14T14:30:00Z" },
                { id: "P003", payment_date: "2025-01-13", company: "한화건설", employee_id: "EMP003", name: "박철수", gender: "남", membership_type: "저녁권", membership_period: 1, has_locker: true, locker_period: 1, locker_number: "B-20", price: 33000, status: "pending", processed: false, memo: "처리대기", toss_payment_key: "test_key_3", toss_order_id: "test_order_3", created_at: "2025-01-13T16:45:00Z", updated_at: "2025-01-13T16:45:00Z" }
              ]}
              onRefresh={() => console.log("새로고침")}
              loading={false}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">결제 내역 테이블 (이용기간 표시)</h2>
            <PaymentHistoryTable
              data={[
                { id: "P001", payment_date: "2025-01-15", company: "한화건설", employee_id: "EMP001", name: "김도윤", gender: "남", membership_type: "종일권", membership_period: 3, has_locker: true, locker_period: 3, locker_number: "A-15", price: 115500, status: "completed", processed: true, memo: "처리완료", toss_payment_key: "test_key_1", toss_order_id: "test_order_1", created_at: "2025-01-15T10:00:00Z", updated_at: "2025-01-15T10:00:00Z" },
                { id: "P002", payment_date: "2025-01-14", company: "한화건설", employee_id: "EMP002", name: "이영희", gender: "여", membership_type: "오전권", membership_period: 3, has_locker: false, locker_period: 0, price: 99000, status: "completed", processed: true, memo: "처리완료", toss_payment_key: "test_key_2", toss_order_id: "test_order_2", created_at: "2025-01-14T14:30:00Z", updated_at: "2025-01-14T14:30:00Z" },
                { id: "P003", payment_date: "2025-01-13", company: "한화건설", employee_id: "EMP003", name: "박철수", gender: "남", membership_type: "저녁권", membership_period: 1, has_locker: true, locker_period: 1, locker_number: "B-20", price: 33000, status: "pending", processed: false, memo: "처리대기", toss_payment_key: "test_key_3", toss_order_id: "test_order_3", created_at: "2025-01-13T16:45:00Z", updated_at: "2025-01-13T16:45:00Z" }
              ]}
              onToggleProcessed={(id, processed) => console.log(`처리 상태 변경: ${id} -> ${processed}`)}
              onUpdateLockerNumber={(id, number) => console.log(`사물함 번호 변경: ${id} -> ${number}`)}
              onUpdateMemo={(id, memo) => console.log(`메모 변경: ${id} -> ${memo}`)}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">환경 변수 설정 확인</h2>
            <EnvironmentCheck showDetails={true} />
          </div>

          {/* 새로운 동의서 컴포넌트 데모 */}
          <div>
            <h2 className="text-2xl font-bold mb-4">동의서 컴포넌트 데모</h2>
            <div className="space-y-6">
              {/* 개인정보처리방침 모달 데모 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">개인정보처리방침 모달</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  로그인 페이지 하단에 표시되는 개인정보처리방침 모달입니다.
                </p>
                <div className="flex justify-center">
                  <PrivacyPolicyModal>
                    <Button variant="outline" size="sm" className="text-sm">
                      개인정보처리방침
                    </Button>
                  </PrivacyPolicyModal>
                </div>
              </div>

              {/* 동의서 모달 데모 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">동의서 모달</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  회원가입 페이지에서 사용되는 동의서 모달입니다.
                </p>
                <div className="flex gap-2">
                  <AgreementModal
                    title="[필수] 통합-서비스 이용약관"
                    content={AGREEMENTS.find(a => a.type === 'service')?.content || ''}
                  >
                    <Button variant="outline" size="sm">
                      서비스 이용약관 보기
                    </Button>
                  </AgreementModal>
                  <AgreementModal
                    title="[필수] 통합-개인정보 수집 및 이용동의"
                    content={AGREEMENTS.find(a => a.type === 'privacy')?.content || ''}
                  >
                    <Button variant="outline" size="sm">
                      개인정보 수집 및 이용동의 보기
                    </Button>
                  </AgreementModal>
                  <AgreementModal
                    title="[선택] 통합-마케팅정보수집이용동의"
                    content={AGREEMENTS.find(a => a.type === 'marketing')?.content || ''}
                  >
                    <Button variant="outline" size="sm">
                      마케팅정보수집이용동의 보기
                    </Button>
                  </AgreementModal>
                </div>
              </div>

              {/* 동의서 관리 시스템 데모 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">동의서 관리 시스템</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  관리자가 동의서를 관리할 수 있는 시스템입니다.
                </p>
                <div className="border rounded-lg p-4">
                  <ExcelStyleAgreementManager />
                </div>
              </div>

              {/* 약관 동의 컴포넌트 데모 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">약관 동의 컴포넌트</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  회원가입 시 사용되는 약관 동의 컴포넌트입니다. SHP 스타일을 적용했습니다.
                </p>
                <div className="max-w-2xl">
                  <TermsAgreement 
                    onAgreementChange={(agreements) => {
                      console.log('약관 동의 상태:', agreements);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}