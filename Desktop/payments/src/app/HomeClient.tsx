"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { PaymentsCard } from "@/components/PaymentsCard"
// useSettings import 제거 (SettingsProvider 의존성 제거)
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"
import type { PaymentEligibility } from "@/app/actions/payment-eligibility"
import type { GlobalSettings } from "@/lib/default-settings"

type HomeClientProps = {
  eligibility: PaymentEligibility | null
  isLoggedIn: boolean
  globalSettings: GlobalSettings
}

export function HomeClient({ eligibility, isLoggedIn, globalSettings }: HomeClientProps) {
  const router = useRouter()
  const { user, loading, error, companyName } = useAuth()
  const supabase = createClient()
  const [agreements, setAgreements] = React.useState<any[]>([])
  
  // 인증 로딩이 길어지는 문제 완화: 서버가 로그인이라면 일정 시간 후 강제 준비 처리
  const [forcedAuthReady, setForcedAuthReady] = React.useState(false)
  React.useEffect(() => {
    if (isLoggedIn && loading && !user) {
      const timer = setTimeout(() => setForcedAuthReady(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoggedIn, loading, user])

  const showAuthLoading = loading && !user && !forcedAuthReady
  // 실제 로그인 상태 확인 (서버/클라이언트 단서 종합)
  const isActuallyLoggedIn = (!!user || isLoggedIn) && !showAuthLoading

  // 결제 자격 상태를 클라이언트에서 재조회하여 보관
  const [eligibilityState, setEligibilityState] = React.useState<PaymentEligibility | null>(eligibility)
  const [eligibilityLoading, setEligibilityLoading] = React.useState(false)
  
  // 인증 오류 처리
  React.useEffect(() => {
    if (error) {
      console.error('인증 오류:', error)
    }
  }, [error])
  
  // 디버깅: 인증 상태 로그
  React.useEffect(() => {
    console.log('🔐 인증 상태 확인:', {
      serverIsLoggedIn: isLoggedIn,
      clientUser: !!user,
      loading,
      error,
      isActuallyLoggedIn,
      userEmail: user?.email
    })
  }, [isLoggedIn, user, loading, error, isActuallyLoggedIn])

  // 로그인 완료 후 결제 자격 재조회
  const retryEligibility = React.useCallback(async () => {
    if (!isActuallyLoggedIn) return
    console.log('🔁 결제 자격 수동 재조회 시작')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)
    try {
      setEligibilityLoading(true)
      const res = await fetch('/api/payment-eligibility', {
        cache: 'no-store',
        credentials: 'include',
        signal: controller.signal,
      })
      if (!res.ok) {
        const text = await res.text()
        console.warn('결제 자격 재조회 실패 응답:', res.status, text)
        setEligibilityState({ eligible: false, reason: '결제 자격 확인에 실패했습니다. 잠시 후 다시 시도해주세요.' } as any)
        return
      }
      const data = await res.json()
      console.log('✅ 결제 자격 재조회 완료:', data)
      setEligibilityState(data)
    } catch (e) {
      console.error('❌ 결제 자격 재조회 오류:', e)
      setEligibilityState({ eligible: false, reason: '네트워크 문제로 결제 자격 확인에 실패했습니다.' } as any)
    } finally {
      clearTimeout(timeoutId)
      setEligibilityLoading(false)
    }
  }, [isActuallyLoggedIn])

  React.useEffect(() => {
    async function refetchEligibility() {
      if (!isActuallyLoggedIn) return
      console.log('🔁 결제 자격 재조회 시작')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      try {
        setEligibilityLoading(true)
        const res = await fetch('/api/payment-eligibility', {
          cache: 'no-store',
          credentials: 'include',
          signal: controller.signal,
        })
        if (!res.ok) {
          const text = await res.text()
          console.warn('결제 자격 재조회 실패 응답:', res.status, text)
          setEligibilityState({ eligible: false, reason: '결제 자격 확인에 실패했습니다. 잠시 후 다시 시도해주세요.' } as any)
          return
        }
        const data = await res.json()
        console.log('✅ 결제 자격 재조회 완료:', data)
        setEligibilityState(data)
      } catch (e) {
        console.error('❌ 결제 자격 재조회 오류:', e)
        setEligibilityState({ eligible: false, reason: '네트워크 문제로 결제 자격 확인에 실패했습니다.' } as any)
      } finally {
        clearTimeout(timeoutId)
        setEligibilityLoading(false)
      }
    }
    refetchEligibility()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActuallyLoggedIn])

  // 서버 전달값보다 클라이언트 재조회 결과를 우선 사용
  const effectiveEligibility = eligibilityState ?? eligibility

  // 디버깅: 자격 결과 상태 추적
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🧩 effectiveEligibility 상태:', effectiveEligibility)
    }
  }, [effectiveEligibility])

  // 동의서 데이터 로드
  React.useEffect(() => {
    async function loadAgreements() {
      try {
        const { data, error } = await supabase
          .from('consent_agreements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: true });

        if (error) {
          console.warn('동의서 조회 실패:', error);
          setAgreements([]);
          return;
        }
        
        setAgreements(data || []);
      } catch (error) {
        console.error('동의서 조회 실패:', error);
        setAgreements([]);
      }
    }
    loadAgreements();
  }, [supabase]);
  
  // 전역 설정을 직접 사용 (SettingsProvider 의존성 제거)
  const settings = globalSettings || {
    membershipPrices: { fullDay: 0, morning: 0, evening: 0 },
    membershipPeriod: 3,
    productStatus: { memberships: { fullDay: true, morning: true, evening: true }, locker: true },
    lockerPrice: 0,
    lockerPeriod: 3,
    membershipStartDate: "2025-01-01",
    lockerStartDate: "2025-01-01",
    registrationPeriod: { startDate: "2025-01-01", endDate: "2025-12-31" }
  }
  
  // mergedSettings를 settings로 별칭 생성 (기존 코드 호환성 유지)
  const mergedSettings = settings
  
  // 디버깅: 전역 설정 로그 출력
  React.useEffect(() => {
    console.log('🏠 홈페이지 전역 설정:', {
      globalSettings: globalSettings?.membershipPrices,
      mergedSettings: mergedSettings?.membershipPrices,
      localSettings: settings?.membershipPrices,
      globalSettingsExists: !!globalSettings,
      mergedSettingsExists: !!mergedSettings
    })
  }, [globalSettings, mergedSettings, settings])
  
  // 사용자 정보 변환 (useAuth 훅에서 받은 user를 Header 컴포넌트 형식으로 변환)
  const userInfo = user ? {
    name: user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
    email: user.email,
    companyName: companyName || user.user_metadata?.company_name,
    role: user.user_metadata?.role as "user" | "admin" || "user"
  } : undefined

  // 서버 결제자격 정보에서 파생되는 사용자 정보(클라이언트 인증 전 헤더용 대체값)
  const fallbackUserFromEligibility = (effectiveEligibility?.userInfo) ? {
    name: effectiveEligibility.userInfo.name,
    email: undefined as string | undefined,
    companyName: effectiveEligibility.userInfo.company_name,
    role: 'user' as const,
  } : undefined

  // 헤더에 표시할 사용자 정보: 클라이언트 사용자 > 서버 자격 사용자
  const headerUser = userInfo || fallbackUserFromEligibility

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await logout()
  }

  // 로그인 핸들러
  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        brandName="GYM29"
        brandLogo="/assets/GYM_29_로고배경없음_jpg.png"
        brandHref="/"
        user={headerUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        variant="default"
        showNavigation={true}
      />

      <main className="flex-1">
        <Hero
          backgroundImage="/assets/1.jpg"
          backgroundSize="cover"
          backgroundPosition="center center"
          backgroundAttachment="scroll"
          overlay={false}
          size="lg"
          variant="centered"
        />

        <div className="container mx-auto py-12 px-4 flex justify-center">
          {/* 로딩 상태 표시 */}
          {(showAuthLoading || (isActuallyLoggedIn && eligibilityLoading)) && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                {showAuthLoading ? '인증 상태를 확인하는 중...' : '결제 자격을 확인하는 중...'}
              </p>
            </div>
          )}
          
          {/* 로딩이 완료되고 로그인하지 않은 경우 */}
          {!showAuthLoading && !isActuallyLoggedIn && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                회원권을 구매하려면 먼저 로그인해주세요.
                <Button
                  variant="link"
                  className="ml-2 p-0 h-auto"
                  onClick={handleLogin}
                >
                  로그인하기
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* 로그인했지만 결제 자격이 아직 없고 재조회가 끝난 경우 (실패/부적합) */}
          {isActuallyLoggedIn && !loading && effectiveEligibility && !effectiveEligibility.eligible && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {effectiveEligibility.reason || '현재 결제할 수 없는 상태입니다.'}
              </AlertDescription>
            </Alert>
          )}

          {/* 로그인했지만 아직 자격 응답이 없는 경우 재시도 버튼 제공 */}
          {isActuallyLoggedIn && !loading && !effectiveEligibility && !eligibilityLoading && (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">결제 자격 확인이 지연되고 있습니다.</p>
              <Button onClick={retryEligibility} variant="outline">다시 시도</Button>
            </div>
          )}

          {/* 로그인했고 결제 자격이 있는 경우 */}
          {isActuallyLoggedIn && !showAuthLoading && effectiveEligibility && effectiveEligibility.eligible && (
            <>
              {/* 결제 자격 상태 표시 - 숨김 처리 */}
              {/* <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {eligibility.eligible ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        결제 가능
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5 text-red-500" />
                        결제 불가
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                  {effectiveEligibility.userInfo && (
                      <div className="text-sm">
                        <p><strong>이름:</strong> {effectiveEligibility.userInfo.name}</p>
                        <p><strong>사번:</strong> {effectiveEligibility.userInfo.employee_id}</p>
                        <p><strong>계열사:</strong> {effectiveEligibility.userInfo.company_name} ({effectiveEligibility.userInfo.company_code})</p>
                      </div>
                    )}
                    
                    {effectiveEligibility.company && (
                      <div className="text-sm mt-4">
                        <p><strong>등록 방식:</strong> {effectiveEligibility.company.mode === 'FCFS' ? '선착순' : '추첨'}</p>
                        <p><strong>계열사 상태:</strong> {effectiveEligibility.company.status === 'active' ? '활성' : '비활성'}</p>
                      </div>
                    )}

                    {effectiveEligibility.whitelistProducts && effectiveEligibility.whitelistProducts.length > 0 && (
                      <div className="text-sm mt-4">
                        <p><strong>구매 가능 상품:</strong></p>
                        <ul className="list-disc list-inside ml-4">
                          {effectiveEligibility.whitelistProducts.includes('fullDay') && <li>종일권</li>}
                          {effectiveEligibility.whitelistProducts.includes('morning') && <li>오전권</li>}
                          {effectiveEligibility.whitelistProducts.includes('evening') && <li>저녁권</li>}
                        </ul>
                      </div>
                    )}

                    {!effectiveEligibility.eligible && effectiveEligibility.reason && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{effectiveEligibility.reason}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 결제 자격이 있는 경우에만 PaymentsCard 표시 */}
              {(() => {
                const userForCard = effectiveEligibility.userInfo || (user ? {
                  companyId: user.user_metadata?.company_code,
                  employee_id: user.user_metadata?.employee_id,
                  name: user.user_metadata?.name || user.email?.split('@')[0] || '사용자'
                } as any : undefined)
                const companyForCard = effectiveEligibility.company
                if (!companyForCard || !userForCard) {
                  return (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        결제 자격은 확인되었지만 사용자 또는 회사 정보가 누락되었습니다. 관리자에게 문의해주세요.
                      </AlertDescription>
                    </Alert>
                  )
                }
                return (
                <div className="w-full max-w-2xl mx-auto">
                  <PaymentsCard
                  user={{
                    companyId: (userForCard as any).company_code || (userForCard as any).companyId,
                    empNo: (userForCard as any).employee_id || (userForCard as any).empNo,
                    name: (userForCard as any).name,
                    preRegisteredProducts: effectiveEligibility.whitelistProducts,
                  }}
                  company={{
                    id: companyForCard.code,
                    code: companyForCard.code,
                    name: companyForCard.name,
                    status: companyForCard.status,
                    mode: companyForCard.mode,
                    quota: companyForCard.quota,
                  }}
                  globalSettings={globalSettings}
                  products={[
                    {
                      id: "fullDay",
                      name: "종일권",
                      description: "오전 6시 ~ 오후 11시",
                      price: mergedSettings.membershipPrices.fullDay,
                      period: mergedSettings.membershipPeriod,
                      remaining: companyForCard.quota.fullDay,
                      isActive: mergedSettings.productStatus.memberships.fullDay,
                    },
                    {
                      id: "morning",
                      name: "오전권",
                      description: "오전 6시 ~ 오후 3시",
                      price: mergedSettings.membershipPrices.morning,
                      period: mergedSettings.membershipPeriod,
                      remaining: companyForCard.quota.morning,
                      isActive: mergedSettings.productStatus.memberships.morning,
                    },
                    {
                      id: "evening",
                      name: "저녁권",
                      description: "오후 3시 ~ 오후 11시",
                      price: mergedSettings.membershipPrices.evening,
                      period: mergedSettings.membershipPeriod,
                      remaining: companyForCard.quota.evening,
                      isActive: mergedSettings.productStatus.memberships.evening,
                    },
                  ]}
                  agreements={agreements.map(agreement => ({
                    id: agreement.id,
                    type: agreement.title.toLowerCase().replace(/\s+/g, '_'),
                    title: agreement.title,
                    required: agreement.is_required,
                    content: agreement.content,
                    version: agreement.version,
                  }))}
                  onPayment={(productId, selectedLocker) => {
                    console.log("결제 요청:", productId, selectedLocker)
                    // TODO: 결제 처리 로직
                  }}
                />
                </div>
                )
              })()}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

