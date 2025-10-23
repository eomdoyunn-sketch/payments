"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckIcon, AlertTriangleIcon, XCircleIcon, ShieldCheckIcon, InfoIcon, AlertCircleIcon, FileText } from "lucide-react"
import { AgreementModal } from "@/components/common/AgreementModal"
import { AGREEMENTS } from "@/lib/agreements"
// useSettings import 제거 (SettingsProvider 의존성 제거)
import type { GlobalSettings } from "@/lib/default-settings"
import { findInWhitelist, loadWhitelist, findAllProductsForUser } from "@/lib/whitelist-utils"
import { runAllGuards } from "@/lib/payment-guards"
import { createPaymentWidget, requestTossPayment, generateOrderId } from "@/lib/toss-payments"
import { calculateEndDate, formatDateForDisplay } from "@/lib/utils"
import { checkPaymentEligibility } from "@/app/actions/payment-eligibility"
import { checkPaymentOverlap } from "@/lib/payment-overlap-check"
import { toast } from "sonner"

// 타입 정의
type Company = {
  id: string
  code?: string // 계열사 코드 (추첨제 명단 관리용)
  name: string
  quota: number
  registered: number
  remaining: number
  mode: "FCFS" | "WHL"
  status?: "active" | "inactive"  // 계열사 활성/비활성 상태
  availableFrom: Date
  availableUntil: Date
}

type Product = {
  id: string
  name: string
  period: string
  price: number
  remaining: number
  startDate: string
  endDate: string
}

type Agreement = {
  type: "personal" | "sensitive" | "utilization"
  title: string
  version: string
  url: string
}

type VerificationStatus = {
  isValid: boolean
  message: string
  validUntil?: Date
}

type User = {
  id?: string // Supabase 사용자 ID (customerKey로 사용)
  companyId: string
  empNo: string
  name: string
  email?: string
  phone?: string
  preRegisteredProducts?: string[] // 미리 등록된 상품 ID 배열
}

type PaymentCardProps = {
  user: User
  company: Company
  products: Product[]
  agreements: Agreement[]
  globalSettings?: GlobalSettings // 전역 설정 추가
  onPayment?: (productId: string, selectedLocker: boolean) => void // optional로 변경
  onVerification?: (empNo: string, name: string) => Promise<VerificationStatus>
}

export function PaymentsCard({
  user,
  company,
  products,
  agreements,
  globalSettings,
  onPayment,
  onVerification
}: PaymentCardProps) {
  // 전역 설정을 직접 사용 (SettingsProvider 의존성 제거)
  const settings = React.useMemo(() => {
    if (!globalSettings) {
      // 기본 설정 반환
      return {
        membershipPrices: { fullDay: 0, morning: 0, evening: 0 },
        membershipPeriod: 3,
        productStatus: { memberships: { fullDay: true, morning: true, evening: true }, locker: true },
        lockerPrice: 0,
        lockerPeriod: 3,
        membershipStartDate: "2025-01-01",
        lockerStartDate: "2025-01-01",
        registrationPeriod: { startDate: "2025-01-01", endDate: "2025-12-31" },
        companyAgreements: {
          companies: {},
          default: {
            personal: { enabled: true, required: true },
            sensitive: { enabled: true, required: true },
            utilization: { enabled: false, required: false }
          }
        }
      }
    }
    
    return globalSettings
  }, [globalSettings])
  
  // 디버깅: PaymentsCard에서 사용하는 설정 로그
  React.useEffect(() => {
    console.log('💳 PaymentsCard 설정:', {
      hasGlobalSettings: !!globalSettings,
      globalPrices: globalSettings?.membershipPrices,
      finalPrices: settings?.membershipPrices
    })
  }, [globalSettings, settings])
  
  // 결제 자격 검증 상태
  const [eligibility, setEligibility] = React.useState<any>(null)
  const [eligibilityLoading, setEligibilityLoading] = React.useState(true)
  
  // 결제 자격 검증 (마운트 시 한번만)
  React.useEffect(() => {
    const checkEligibility = async () => {
      setEligibilityLoading(true)
      try {
        const result = await checkPaymentEligibility()
        setEligibility(result)
        
        if (!result.eligible) {
          toast.error(result.reason || '결제 자격이 없습니다.')
        }
      } catch (error) {
        console.error('결제 자격 검증 실패:', error)
        toast.error('결제 자격을 확인할 수 없습니다.')
      } finally {
        setEligibilityLoading(false)
      }
    }
    checkEligibility()
  }, [])
  
  // 회사 모드 및 상품 상태 확인 로그 (디버깅용)
  React.useEffect(() => {
    console.log('🏢 PaymentsCard - 회사 정보:', {
      name: company.name,
      code: company.code,
      mode: company.mode,
      modeType: typeof company.mode,
      isWHL: company.mode === "WHL",
      isFCFS: company.mode === "FCFS",
      eligibility: eligibility
    })
    
    console.log('🔧 상품 상태 설정:', {
      productStatus: settings.productStatus,
      membershipPrices: settings.membershipPrices,
      fullDay: settings.productStatus.memberships.fullDay,
      morning: settings.productStatus.memberships.morning,
      evening: settings.productStatus.memberships.evening,
      locker: settings.productStatus.locker
    })
  }, [company, eligibility, settings])
  
  // 상태 관리
  const [selectedProducts, setSelectedProducts] = React.useState<string[]>(() => {
    // WHL 모드에서는 미리 등록된 첫 번째 상품을 자동 선택
    if (company.mode === "WHL" && user.preRegisteredProducts && user.preRegisteredProducts.length > 0) {
      return [user.preRegisteredProducts[0]]
    }
    return []
  })
  const [selectedLocker, setSelectedLocker] = React.useState<boolean>(false)
  const [empNoInput, setEmpNoInput] = React.useState(user.empNo)
  const [nameInput, setNameInput] = React.useState(user.name)
  const [verificationStatus, setVerificationStatus] = React.useState<VerificationStatus | null>(null)
  // 동의서는 회원가입 시에만 받음 - 결제 시에는 동의서 없음
  const [agreementViewed, setAgreementViewed] = React.useState<Record<string, boolean>>({
    personal: false,
    sensitive: false,
    utilization: false
  })
  
  // 동의서 모달 상태
  // 동의서 모달 관련 상태 제거 - 결제 시에는 동의서 없음
  
  // 결제위젯 관련 상태
  const widgetsRef = React.useRef<any>(null)
  const [isPaymentMethodRendered, setIsPaymentMethodRendered] = React.useState(false)
  const [isWidgetLoading, setIsWidgetLoading] = React.useState(false)

  // ⚠️ 등록 기간 제한 비활성화됨 - 계열사별 활성 상태만 사용
  // 현재 시간 체크 (클라이언트에서만) - 비활성화됨
  const [now, setNow] = React.useState<Date | null>(new Date())
  const [isWithinPeriod] = React.useState(true)  // 항상 기간 내로 설정
  const [isPeriodBefore] = React.useState(false)  // 항상 false
  const [isPeriodAfter] = React.useState(false)   // 항상 false

  // 등록 기간 체크 비활성화 - 계열사별 활성 상태만 사용
  React.useEffect(() => {
    setNow(new Date())
  }, [])
  
  // 결제 가능 여부 확인 (통합 가드 사용) - useEffect보다 먼저 선언
  const guardResult = React.useMemo(() => {
    return runAllGuards({
      settings,
      userCompanyId: user.companyId,
      company,
      selectedProducts,
      selectedLocker,
      // agreementChecks 제거 - 결제 시에는 동의서 없음
      isWHLVerified: verificationStatus?.isValid || false,
      products
    })
  }, [settings, user.companyId, company, selectedProducts, selectedLocker, verificationStatus, products])

  const canPay = guardResult.canPass
  const getDisabledReason = () => guardResult.reason
  
  // 결제위젯 초기화 및 결제 수단 UI 렌더링
  React.useEffect(() => {
    // 상품이 선택되지 않았으면 결제 수단 UI를 렌더링하지 않음
    if (selectedProducts.length === 0 || !canPay) {
      setIsPaymentMethodRendered(false)
      return
    }
    
    // customerKey 생성
    const customerKey = user.id || `GYM29_${user.empNo}`
    
    // 결제 금액 계산
    const selectedProduct = products.find(p => p.id === selectedProducts[0])
    if (!selectedProduct) return
    
    const productPrice = settings.membershipPrices[
      selectedProduct.name === "종일권" ? "fullDay" : 
      selectedProduct.name === "오전권" ? "morning" : "evening"
    ]
    const lockerPrice = selectedLocker ? settings.lockerPrice : 0
    const totalAmount = productPrice + lockerPrice
    
    // 결제위젯 초기화 및 렌더링
    const initializeWidget = async () => {
      try {
        setIsWidgetLoading(true)
        
        // DOM 요소가 존재하는지 확인하고 대기
        let paymentMethodElement = document.getElementById('payment-method')
        if (!paymentMethodElement) {
          console.warn('⚠️ payment-method 요소를 찾을 수 없습니다. DOM이 아직 준비되지 않았을 수 있습니다.')
          // DOM이 준비될 때까지 잠시 대기
          await new Promise(resolve => setTimeout(resolve, 200))
          paymentMethodElement = document.getElementById('payment-method')
          if (!paymentMethodElement) {
            throw new Error('payment-method DOM 요소를 찾을 수 없습니다.')
          }
        }
        
        // 기존 위젯이 있으면 제거
        if (widgetsRef.current) {
          paymentMethodElement.innerHTML = ''
        }
        
        console.log('🔧 결제위젯 초기화 중...', { customerKey, totalAmount })
        
        // 결제위젯 생성
        const widgets = await createPaymentWidget(customerKey)
        widgetsRef.current = widgets
        
        console.log('✅ 결제위젯 생성 완료:', widgets)
        
        // 결제 금액 설정
        await widgets.setAmount({
          currency: 'KRW',
          value: totalAmount
        })
        
        console.log('✅ 결제 금액 설정 완료:', totalAmount)
        
        // 결제 수단 UI 렌더링
        await widgets.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT'
        })
        
        setIsPaymentMethodRendered(true)
        console.log('✅ 결제위젯 렌더링 완료')
        
        // 사용자에게 카드 정보 선택 안내
        toast.info('카드사와 할부 기간을 선택해주세요.', {
          description: '결제 수단에서 원하는 카드사와 할부 기간을 선택한 후 결제하기 버튼을 눌러주세요.'
        })
      } catch (error) {
        console.error('❌ 결제위젯 초기화 실패:', error)
        console.error('❌ 에러 상세:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
        toast.error(`결제위젯 로딩 중 오류가 발생했습니다: ${error.message}`)
        setIsPaymentMethodRendered(false)
      } finally {
        setIsWidgetLoading(false)
      }
    }
    
    // DOM 업데이트 후 위젯 초기화
    setTimeout(initializeWidget, 100)
  }, [selectedProducts, selectedLocker, user.id, user.empNo, products, settings, canPay])

  // 계열사 일치 확인
  const isCompanyMatch = user.companyId === company.id
  
  // 명단 확인 처리
  const handleVerification = React.useCallback(async () => {
    if (!onVerification || !empNoInput || !nameInput) return
    
    try {
      const result = await onVerification(empNoInput, nameInput)
      setVerificationStatus(result)
    } catch {
      setVerificationStatus({
        isValid: false,
        message: "명단 확인 중 오류가 발생했습니다."
      })
    }
  }, [onVerification, empNoInput, nameInput])

  // 본인확인 필요 여부 (WHL 모드에서만, 그리고 로그인 정보가 명단과 일치하지 않을 때만)
  const needsVerification = company.mode === "WHL" && !verificationStatus?.isValid

  // WHL 모드에서 eligibility 결과를 기반으로 자동 검증 설정
  React.useEffect(() => {
    if (eligibility?.eligible && company.mode === "WHL" && eligibility.whitelistProducts) {
      // 추첨 명단에 있는 경우 자동으로 검증 완료 상태로 설정
      setVerificationStatus({
        isValid: true,
        message: `${company.name}의 추첨 명단에서 확인되었습니다.`
      })
      
      // 첫 번째 가능한 회원권 자동 선택
      if (selectedProducts.length === 0 && eligibility.whitelistProducts.length > 0) {
        const firstProductId = products.find(p => {
          const productType = p.name === "종일권" ? "fullDay" : p.name === "오전권" ? "morning" : "evening"
          return eligibility.whitelistProducts?.includes(productType)
        })?.id
        
        if (firstProductId) {
          setSelectedProducts([firstProductId])
        }
      }
    }
  }, [eligibility, company.mode, company.name, products, selectedProducts.length])

  // 상태 배지는 제거됨 (사용자에게 배정/등록/잔여/여유 표시 불필요)

  // 결제 처리
  const handlePayment = async () => {
    console.log('🔘 결제하기 버튼 클릭됨')
    console.log('📊 결제 가능 여부:', { canPay, selectedProductsCount: selectedProducts.length })
    
    if (!canPay || selectedProducts.length === 0) {
      console.warn('⚠️ 결제 불가능:', { canPay, selectedProductsCount: selectedProducts.length })
      return
    }
    
    if (!widgetsRef.current) {
      console.error('❌ 결제위젯이 초기화되지 않았습니다')
      toast.error('결제위젯을 로딩하는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }
    
    // 선택된 상품 정보
    const selectedProduct = products.find(p => p.id === selectedProducts[0])
    if (!selectedProduct) {
      console.error('❌ 선택된 상품을 찾을 수 없음')
      return
    }
    
    // 결제 금액 계산
    const productPrice = settings.membershipPrices[
      selectedProduct.name === "종일권" ? "fullDay" : 
      selectedProduct.name === "오전권" ? "morning" : "evening"
    ]
    const lockerPrice = selectedLocker ? settings.lockerPrice : 0
    const totalAmount = productPrice + lockerPrice
    
    console.log('💰 결제 금액 계산:', {
      productName: selectedProduct.name,
      productPrice,
      lockerPrice,
      totalAmount
    })
    
    // 주문명 생성
    const orderName = selectedLocker 
      ? `${selectedProduct.name} + 개인사물함`
      : selectedProduct.name
    
    // customerKey 생성 (사용자 ID 또는 empNo 사용)
    const customerKey = user.id || `GYM29_${user.empNo}`
    
    console.log('👤 사용자 정보:', {
      customerKey,
      userName: user.name,
      userEmail: user.email
    })
    
    try {
      console.log('💳 토스페이먼츠 결제 요청 시작')
      
      // 이용기간 겹침 확인
      console.log('🔍 이용기간 겹침 확인 중...')
      try {
        const overlapCheck = await checkPaymentOverlap(
          user.empNo || user.id,
          selectedProduct.name,
          settings.membershipPeriod || 3,
          selectedLocker,
          selectedLocker ? (settings.lockerPeriod || 3) : 0,
          settings.membershipStartDate || '2025-01-01',
          settings.lockerStartDate || '2025-01-01'
        )
        
        if (overlapCheck.hasOverlap) {
          console.warn('⚠️ 이용기간 겹침 감지:', overlapCheck.message)
          toast.error('이용기간이 겹치는 결제가 있습니다', {
            description: overlapCheck.message,
            duration: 5000
          })
          return
        }
        
        console.log('✅ 이용기간 겹침 없음, 결제 진행 가능')
      } catch (overlapError) {
        console.error('❌ 이용기간 겹침 확인 중 오류:', overlapError)
        // 겹침 확인 실패해도 결제는 진행 (사용자 경험 우선)
        console.log('⚠️ 겹침 확인 실패했지만 결제를 계속 진행합니다.')
      }
      
      // onPayment가 있으면 호출 (기존 로직 호환성)
      if (onPayment) {
        console.log('🔄 onPayment 콜백 호출')
        onPayment(selectedProducts[0], selectedLocker)
        // onPayment 호출 후에도 토스페이먼츠 결제 진행
      }
      
      // 사용자에게 카드 정보 선택 안내
      toast.info('결제 수단을 확인하고 있습니다...', {
        description: '카드사와 할부 기간이 선택되었는지 확인해주세요.'
      })
      
      // 결제 정보를 sessionStorage에 저장
      const paymentInfo = {
        membershipType: selectedProduct.name,
        membershipPeriod: settings.membershipPeriod || 3, // 통합된 이용기간 사용
        hasLocker: selectedLocker,
        lockerPeriod: selectedLocker ? settings.lockerPeriod : 0
      }
      sessionStorage.setItem('pendingPaymentInfo', JSON.stringify(paymentInfo))
      console.log('💾 결제 정보 저장:', paymentInfo)
      
      // 토스페이먼츠 결제 요청
      await requestTossPayment(widgetsRef.current, {
        amount: totalAmount,
        orderId: generateOrderId(),
        orderName,
        customerName: user.name,
        customerEmail: user.email,
        customerMobilePhone: user.phone,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerKey
      })
      
      console.log('✅ 결제 요청 완료')
    } catch (error: any) {
      console.error('❌ 결제 요청 실패:', error)
      
      // 사용자 친화적인 오류 메시지 표시
      const errorMessage = error?.message || '결제 요청 중 오류가 발생했습니다.'
      
      // 결제 취소인 경우 특별 처리 (오류로 표시하지 않음)
      if (error?.message?.includes('결제가 취소되었습니다') || 
          error?.code === 'USER_CANCEL') {
        console.log('사용자가 결제를 취소했습니다.')
        toast.info('결제가 취소되었습니다', {
          description: '결제를 원하시면 다시 시도해주세요.',
          duration: 3000
        })
        return // 오류로 처리하지 않고 정상 종료
      }
      // 카드 정보 선택 오류인 경우 특별 안내
      else if (error?.message?.includes('카드사와 할부 기간을 선택해주세요') || 
          error?.message?.includes('카드 결제 정보를 선택해주세요') || 
          error?.code === 'NEED_CARD_PAYMENT_DETAIL') {
        toast.error('결제 수단을 선택해주세요', {
          description: '결제 수단 영역에서 카드사를 선택하고 할부 기간을 설정한 후 다시 시도해주세요.',
          duration: 5000
        })
      } else if (error?.message?.includes('CORB') || error?.message?.includes('Cross-Origin')) {
        console.warn('⚠️ CORB 오류 발생. 브라우저를 새로고침하거나 다른 브라우저를 사용해보세요.')
        toast.error('결제 시스템에 일시적인 문제가 발생했습니다.', {
          description: '브라우저를 새로고침하거나 잠시 후 다시 시도해주세요.',
          duration: 5000
        })
      } else {
        toast.error('결제 요청 실패', {
          description: errorMessage,
          duration: 5000
        })
      }
    }
  }

  // 선택된 상품 정보 (첫 번째 선택 상품)
  const selectedProductInfo = selectedProducts.length > 0 ? products.find(p => p.id === selectedProducts[0]) : undefined
  
  // 카드 노출 여부 결정 (선착순/추첨제 로직 적용)
  if (!isCompanyMatch) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="py-12">
          <Alert variant="destructive">
            <XCircleIcon className="w-4 h-4" />
            <AlertDescription className="text-center">
              등록 예정 명단에서 확인되지 않았습니다. 회사 담당자에게 문의해 주세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // ⚠️ 등록 기간 체크 비활성화됨 - 아래 체크들은 실행되지 않음
  // 결제 제어는 계열사별 활성 상태로만 관리됨
  
  /* 비활성화된 등록 기간 체크 로직
  if (now === null) {
    return <div>로딩 중...</div>
  }
  if (isPeriodBefore || isPeriodAfter) {
    return <div>등록 기간이 아닙니다</div>
  }
  */

  // 선착순(FCFS) 모드: 잔여가 0이면 마감 표시
  if (company.mode === "FCFS" && company.remaining === 0) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="py-12">
          <Alert variant="destructive">
            <InfoIcon className="w-4 h-4" />
            <AlertDescription className="text-center">
              현재 마감되었습니다. 다음 등록 기간에 참여해 주세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // 추첨제(WHL) 모드: 명단에서 확인되지 않은 경우
  if (company.mode === "WHL" && verificationStatus && !verificationStatus.isValid) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-xl">{company.name}</CardTitle>
            <Badge variant="outline">추첨제</Badge>
          </div>
        </CardHeader>
        <CardContent className="py-12 space-y-6">
          <Alert variant="destructive">
            <XCircleIcon className="w-4 h-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">추첨 대상자가 아닙니다.</p>
                <p className="text-sm">
                  현재 추첨 명단에서 확인되지 않았습니다. 관리자에게 문의해 주세요.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  // 자격 검증 로딩 중
  if (eligibilityLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">결제 자격을 확인하는 중...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 자격 없음 (추첨 명단에 없는 경우)
  if (eligibility && !eligibility.eligible) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <XCircleIcon className="w-5 h-5 text-destructive" />
            결제 자격 없음
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircleIcon className="w-4 h-4" />
            <AlertDescription className="space-y-2">
              <p className="font-medium">{eligibility.reason}</p>
              {eligibility.userInfo && (
                <div className="text-sm mt-2 space-y-1">
                  <p>• 이름: {eligibility.userInfo.name}</p>
                  <p>• 계열사: {eligibility.userInfo.company_name} ({eligibility.userInfo.company_code})</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
          
          {eligibility.company?.mode === 'WHL' && (
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <h3 className="font-medium text-sm">📋 추첨제 안내</h3>
              <p className="text-sm text-muted-foreground">
                현재 계열사는 추첨제로 운영되고 있습니다. 
                추첨 명단에 등록된 분만 결제가 가능합니다.
              </p>
              <p className="text-sm text-muted-foreground">
                자세한 사항은 계열사 담당자에게 문의해주세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-xl">{company.name}</CardTitle>
          <Badge variant="outline">
            {company.mode === "FCFS" ? "선착순" : "추첨제"}
          </Badge>
        </div>
        
        {/* 추첨 명단 확인 완료 표시 */}
        {eligibility?.eligible && company.mode === "WHL" && (
          <Alert className="mt-4">
            <CheckIcon className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-sm">
              <span className="font-medium text-green-600">✅ 추첨 명단 확인 완료</span>
              <div className="mt-1 text-muted-foreground">
                {eligibility.whitelistProducts && eligibility.whitelistProducts.length > 0 && (
                  <span>등록 가능한 상품: {
                    eligibility.whitelistProducts.map((p: string) => 
                      p === 'fullDay' ? '종일권' : p === 'morning' ? '오전권' : '저녁권'
                    ).join(', ')
                  }</span>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-6">

        {/* 본인확인 (WHL 모드에서만 표시) */}
        {company.mode === "WHL" && needsVerification && (
          <>
            <div className="space-y-4">
              <Label className="text-base font-medium">본인확인</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empNo">사번</Label>
                  <Input
                    id="empNo"
                    value={empNoInput}
                    onChange={(e) => setEmpNoInput(e.target.value)}
                    placeholder="사번을 입력하세요"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="이름을 입력하세요"
                  />
                </div>
              </div>
              <Button onClick={handleVerification} disabled={!empNoInput || !nameInput}>
                명단확인
              </Button>
              
              {verificationStatus && (
                <Alert variant={verificationStatus.isValid ? "default" : "destructive"}>
                  {verificationStatus.isValid ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <XCircleIcon className="w-4 h-4" />
                  )}
                  <AlertDescription>
                    {verificationStatus.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* 상품 선택 */}
        <div className="space-y-4">
          <Label className="text-base font-medium">상품 선택</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map((product) => {
              // 상품 활성/비활성 상태 확인
              const productType = product.name === "종일권" ? "fullDay" : product.name === "오전권" ? "morning" : "evening"
              const isProductActive = settings.productStatus.memberships[productType]
              
              // 선착순 모드: 잔여 수량이 있으면 선택 가능
              // 추첨제 모드: eligibility.whitelistProducts에 등록된 회원권만 선택 가능
              const isInWhitelist = company.mode === "WHL" 
                ? (eligibility?.whitelistProducts?.includes(productType) ?? false)
                : false
              
              const isAvailable = isProductActive && (
                company.mode === "FCFS" 
                  ? product.remaining > 0  // 선착순: 잔여 수량 있으면 가능
                  : isInWhitelist          // 추첨제: 명단에 등록된 회원권만 가능
              )
              
              const isSelected = selectedProducts.includes(product.id)
              
              return (
                <div
                  key={product.id}
                  className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-input hover:bg-accent"
                  } ${!isAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={() => {
                    if (!isAvailable) return
                    // 단일 선택 모드: 이미 선택된 상품을 클릭하면 해제, 다른 상품을 클릭하면 교체
                    if (isSelected) {
                      setSelectedProducts([])
                      setSelectedLocker(false) // 회원권 해제 시 개인사물함도 취소
                    } else {
                      setSelectedProducts([product.id])
                    }
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={!isAvailable}
                    onCheckedChange={(checked) => {
                      if (!isAvailable) return
                      if (checked) {
                        setSelectedProducts([product.id]) // 단일 선택
                      } else {
                        setSelectedProducts([])
                        setSelectedLocker(false) // 회원권 해제 시 개인사물함도 취소
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1"
                  />
                    <div className="flex-1 flex items-center justify-between gap-2">
                      {/* 상품명을 왼쪽에 가로로 표시 */}
                      <div className="flex flex-col space-y-1 min-w-0">
                        <div 
                          className="font-medium text-sm korean-horizontal"
                          style={{ 
                            writingMode: 'horizontal-tb', 
                            textOrientation: 'mixed',
                            direction: 'ltr',
                            unicodeBidi: 'normal',
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            transform: 'none',
                            WebkitWritingMode: 'horizontal-tb',
                            MozWritingMode: 'horizontal-tb',
                            msWritingMode: 'horizontal-tb'
                          }}
                        >
                          {product.name}
                        </div>
                      </div>
                      
                      {/* 오른쪽에 가격 표시 */}
                      <div className="text-right min-w-0">
                        <p className="font-semibold text-base whitespace-nowrap">
                          ₩{settings.membershipPrices[product.name === "종일권" ? "fullDay" : product.name === "오전권" ? "morning" : "evening"].toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {settings.membershipPeriod}개월
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
        </div>

        {/* 개인사물함 선택 (회원권 선택 시에만 표시) */}
        {selectedProducts.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">개인사물함</Label>
            <div 
              className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
                selectedLocker
                  ? "border-primary bg-primary/5"
                  : "border-input hover:bg-accent"
              } ${!settings.productStatus.locker ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => {
                if (settings.productStatus.locker) {
                  setSelectedLocker(!selectedLocker)
                }
              }}
            >
              <Checkbox
                id="locker"
                checked={selectedLocker}
                disabled={!settings.productStatus.locker}
                onCheckedChange={(checked) => setSelectedLocker(checked as boolean)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 space-y-1">
                <div 
                  className="font-semibold cursor-pointer korean-horizontal"
                  style={{ 
                    writingMode: 'horizontal-tb', 
                    textOrientation: 'mixed',
                    direction: 'ltr',
                    unicodeBidi: 'normal',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    transform: 'none',
                    WebkitWritingMode: 'horizontal-tb',
                    MozWritingMode: 'horizontal-tb',
                    msWritingMode: 'horizontal-tb'
                  }}
                >
                  개인사물함 ({settings.lockerPeriod}개월)
                </div>
                <p className="text-sm text-muted-foreground">
                  개인 전용 사물함을 {settings.lockerPeriod}개월간 이용할 수 있습니다.
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">
                  ₩{settings.lockerPrice.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">{settings.lockerPeriod}개월</p>
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* 동의서는 회원가입 시에만 받음 - 결제 시에는 동의서 없음 */}

        {/* 결제 요약 */}
        {selectedProductInfo && (
          <div className="space-y-3">
            <Label className="text-base font-medium">결제 요약</Label>
            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
              <div className="space-y-2 text-sm">
                {/* 상품 */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품</span>
                  <div className="text-right space-y-2">
                    <div className="font-medium">{selectedProductInfo.name}</div>
                    {selectedLocker && (
                      <div className="font-medium">개인사물함</div>
                    )}
                  </div>
                </div>
                
                {/* 이용기간 */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">이용기간</span>
                  <div className="text-right space-y-2">
                    <div className="font-medium">
                      {formatDateForDisplay(settings.membershipStartDate || '2025-01-01')} ~ {formatDateForDisplay(calculateEndDate(settings.membershipStartDate || '2025-01-01', settings.membershipPeriod || 3))}
                    </div>
                    {selectedLocker && (
                      <div className="font-medium">
                        {formatDateForDisplay(settings.lockerStartDate || '2025-01-01')} ~ {formatDateForDisplay(calculateEndDate(settings.lockerStartDate || '2025-01-01', settings.lockerPeriod || 3))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 금액 */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">금액</span>
                  <div className="text-right space-y-2 flex flex-col">
                    <div className="font-semibold">
                      ₩ {settings.membershipPrices[selectedProductInfo.name === "종일권" ? "fullDay" : selectedProductInfo.name === "오전권" ? "morning" : "evening"].toLocaleString()}
                    </div>
                    {selectedLocker && (
                      <div className="font-semibold">
                        ₩ {settings.lockerPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* 합계 */}
              <div className="flex justify-between items-center text-base">
                <span className="font-semibold">합계 (부가세 포함)</span>
                <span className="text-2xl font-bold">
                  ₩ {(
                    settings.membershipPrices[selectedProductInfo.name === "종일권" ? "fullDay" : selectedProductInfo.name === "오전권" ? "morning" : "evening"] + 
                    (selectedLocker ? settings.lockerPrice : 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* 결제 수단 선택 (결제위젯 UI) */}
        {selectedProducts.length > 0 && canPay && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-base font-medium">결제 수단</Label>
              </div>
              
              {isWidgetLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <div className="text-sm text-muted-foreground">결제 수단을 불러오는 중...</div>
                  </div>
                </div>
              )}
              
              <div id="payment-method" className="min-h-[200px] border rounded-lg p-4 bg-muted/20">
                {!isPaymentMethodRendered && !isWidgetLoading && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground space-y-2">
                    <div className="text-center">
                      <p className="font-medium">결제 수단을 불러오는 중...</p>
                      <p className="text-xs">잠시만 기다려주세요</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 결제 수단 로드 완료 안내문 제거 */}
            </div>
            <Separator />
          </>
        )}

        {/* CTA */}
        <div className="space-y-3">
          <Button
            onClick={handlePayment}
            disabled={!canPay}
            className="w-full"
            size="lg"
          >
            결제하기
          </Button>
          
          {!canPay && (
            <Alert>
              <AlertTriangleIcon className="w-4 h-4" />
              <AlertDescription className="text-sm">
                {getDisabledReason()}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>결제 정보는 암호화되어 안전하게 처리됩니다.</span>
          </div>
        </div>
      </CardContent>


      {/* 동의서 모달 제거 - 결제 시에는 동의서 없음 */}
    </Card>
  )
}
