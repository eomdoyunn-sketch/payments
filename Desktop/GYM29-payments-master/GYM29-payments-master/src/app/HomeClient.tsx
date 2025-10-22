"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { PaymentsCard } from "@/components/PaymentsCard"
import { useSettings } from "@/contexts/SettingsContext"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import { handleAuthError, isValidSupabaseClient, clearAuthTokens } from "@/lib/auth-utils"
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
  const { settings } = useSettings()
  const router = useRouter()
  const supabase = createClient()
  
  // 전역 설정과 로컬 설정을 병합 (전역 설정 우선)
  const mergedSettings = {
    ...settings,
    membershipPrices: globalSettings?.membershipPrices || settings.membershipPrices,
    membershipPeriod: globalSettings?.membershipPeriod || settings.membershipPeriod,
    productStatus: globalSettings?.productStatus || settings.productStatus,
    lockerPrice: globalSettings?.lockerPrice || settings.lockerPrice,
    lockerPeriod: globalSettings?.lockerPeriod || settings.lockerPeriod,
    membershipStartDate: globalSettings?.membershipStartDate || settings.membershipStartDate,
    lockerStartDate: globalSettings?.lockerStartDate || settings.lockerStartDate,
  }
  
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
  
  // 사용자 상태 관리
  const [user, setUser] = React.useState<{
    name: string
    email?: string
    companyName?: string
    role?: "user" | "admin"
  } | undefined>(undefined)

  // 로그인한 사용자 정보 가져오기
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    // Supabase 클라이언트가 유효한지 확인
    if (!isValidSupabaseClient(supabase)) {
      console.warn('Supabase 클라이언트가 초기화되지 않았거나 유효하지 않습니다.')
      setUser(undefined)
      return
    }
    
    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // Refresh token 오류 등 인증 관련 오류 처리
        if (sessionError) {
          handleAuthError(sessionError)
          setUser(undefined)
          return
        }
        
        if (!session?.user) {
          setUser(undefined)
          return
        }

        const authUser = session.user
        
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileError) {
          console.warn('사용자 프로필 조회 중 오류:', profileError.message)
          return
        }

        if (profile) {
          const userData = {
            name: profile.name,
            email: profile.email,
            companyName: profile.company_name,
            role: profile.role as "user" | "admin"
          }
          setUser(userData)
        }
      } catch (error) {
        console.error('사용자 정보 조회 중 예상치 못한 오류:', error)
        setUser(undefined)
      }
    }

    getUser()

    // 인증 상태 변경 리스너 등록
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('인증 상태 변경:', event, session?.user?.id)
      
      // 토큰 갱신 실패 시 처리
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log('토큰 갱신 실패로 인한 로그아웃')
        clearAuthTokens()
        setUser(undefined)
        return
      }
      
      getUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

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
        user={user}
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
          {!isLoggedIn && (
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

          {isLoggedIn && eligibility && (
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
                    {eligibility.userInfo && (
                      <div className="text-sm">
                        <p><strong>이름:</strong> {eligibility.userInfo.name}</p>
                        <p><strong>사번:</strong> {eligibility.userInfo.employee_id}</p>
                        <p><strong>계열사:</strong> {eligibility.userInfo.company_name} ({eligibility.userInfo.company_code})</p>
                      </div>
                    )}
                    
                    {eligibility.company && (
                      <div className="text-sm mt-4">
                        <p><strong>등록 방식:</strong> {eligibility.company.mode === 'FCFS' ? '선착순' : '추첨'}</p>
                        <p><strong>계열사 상태:</strong> {eligibility.company.status === 'active' ? '활성' : '비활성'}</p>
                      </div>
                    )}

                    {eligibility.whitelistProducts && eligibility.whitelistProducts.length > 0 && (
                      <div className="text-sm mt-4">
                        <p><strong>구매 가능 상품:</strong></p>
                        <ul className="list-disc list-inside ml-4">
                          {eligibility.whitelistProducts.includes('fullDay') && <li>종일권</li>}
                          {eligibility.whitelistProducts.includes('morning') && <li>오전권</li>}
                          {eligibility.whitelistProducts.includes('evening') && <li>저녁권</li>}
                        </ul>
                      </div>
                    )}

                    {!eligibility.eligible && eligibility.reason && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{eligibility.reason}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 결제 자격이 있는 경우에만 PaymentsCard 표시 */}
              {eligibility.eligible && eligibility.company && eligibility.userInfo && (
                <div className="w-full max-w-2xl mx-auto">
                  <PaymentsCard
                  user={{
                    companyId: eligibility.userInfo.company_code,
                    empNo: eligibility.userInfo.employee_id,
                    name: eligibility.userInfo.name,
                    preRegisteredProducts: eligibility.whitelistProducts,
                  }}
                  company={{
                    id: eligibility.company.code,
                    code: eligibility.company.code,
                    name: eligibility.company.name,
                    status: eligibility.company.status,
                    mode: eligibility.company.mode,
                    quota: eligibility.company.quota,
                  }}
                  globalSettings={globalSettings}
                  products={[
                    {
                      id: "fullDay",
                      name: "종일권",
                      description: "오전 6시 ~ 오후 11시",
                      price: mergedSettings.membershipPrices.fullDay,
                      period: mergedSettings.membershipPeriod,
                      remaining: eligibility.company.quota.fullDay,
                      isActive: mergedSettings.productStatus.memberships.fullDay,
                    },
                    {
                      id: "morning",
                      name: "오전권",
                      description: "오전 6시 ~ 오후 3시",
                      price: mergedSettings.membershipPrices.morning,
                      period: mergedSettings.membershipPeriod,
                      remaining: eligibility.company.quota.morning,
                      isActive: mergedSettings.productStatus.memberships.morning,
                    },
                    {
                      id: "evening",
                      name: "저녁권",
                      description: "오후 3시 ~ 오후 11시",
                      price: mergedSettings.membershipPrices.evening,
                      period: mergedSettings.membershipPeriod,
                      remaining: eligibility.company.quota.evening,
                      isActive: mergedSettings.productStatus.memberships.evening,
                    },
                  ]}
                  agreements={[
                    {
                      id: "personal",
                      type: "personal",
                      title: "개인정보 수집 및 이용 동의",
                      required: true,
                      content: "개인정보 수집 및 이용에 대한 동의 내용...",
                      version: "v1.0",
                    },
                    {
                      id: "sensitive",
                      type: "sensitive",
                      title: "민감정보 처리 동의",
                      required: true,
                      content: "민감정보 처리에 대한 동의 내용...",
                      version: "v1.0",
                    },
                    {
                      id: "utilization",
                      type: "utilization",
                      title: "정보 활용 동의",
                      required: false,
                      content: "정보 활용에 대한 동의 내용...",
                      version: "v1.0",
                    },
                  ]}
                  onPayment={(productId, selectedLocker) => {
                    console.log("결제 요청:", productId, selectedLocker)
                    // TODO: 결제 처리 로직
                  }}
                />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

