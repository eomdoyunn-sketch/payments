"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { logout } from "@/app/actions/auth"
import { User, Building2, Mail, Phone, IdCard, Calendar, Shield } from "lucide-react"

export default function MyPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = React.useState<{
    name: string
    email?: string
    companyName?: string
    role?: "user" | "admin"
  } | undefined>(undefined)

  const [profile, setProfile] = React.useState<{
    name: string
    email: string
    employee_id: string
    company_code: string
    company_name: string
    gender: string | null
    role: string
    marketing_agreed: boolean
    created_at: string
  } | null>(null)

  const [payments, setPayments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  // 사용자 정보 가져오기
  React.useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (!authUser) {
          router.push('/login')
          return
        }

        // user_profiles에서 상세 정보 가져오기
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (profileData) {
          setProfile(profileData)
          setUser({
            name: profileData.name,
            email: profileData.email,
            companyName: profileData.company_name,
            role: profileData.role as "user" | "admin"
          })

          // 결제 내역 가져오기
          const { data: paymentsData, error: paymentsError } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', authUser.id)
            .order('payment_date', { ascending: false })

          if (paymentsError) {
            console.error('결제 내역 조회 실패:', paymentsError)
          } else if (paymentsData) {
            setPayments(paymentsData)
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase, router])

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">로딩 중...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground mb-4">사용자 정보를 찾을 수 없습니다.</div>
          <Button onClick={() => router.push('/login')}>로그인</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 헤더 */}
      <Header
        variant="sticky"
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
            <p className="text-muted-foreground">회원 정보 및 이용 현황을 확인하세요</p>
          </div>

          {/* 프로필 카드 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                프로필 정보
              </CardTitle>
              <CardDescription>회원가입 시 등록한 정보입니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 이름 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">이름</div>
                <div className="flex-1 font-medium">{profile.name}</div>
              </div>

              <Separator />

              {/* 이메일 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  이메일
                </div>
                <div className="flex-1 font-medium">{profile.email}</div>
              </div>

              <Separator />

              {/* 사번 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground flex items-center gap-2">
                  <IdCard className="h-4 w-4" />
                  사번
                </div>
                <div className="flex-1 font-medium">{profile.employee_id}</div>
              </div>

              <Separator />

              {/* 계열사 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  계열사
                </div>
                <div className="flex-1">
                  <div className="font-medium">{profile.company_name}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    코드: {profile.company_code}
                  </div>
                </div>
              </div>

              <Separator />

              {/* 성별 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">성별</div>
                <div className="flex-1 font-medium">{profile.gender || '-'}</div>
              </div>

              <Separator />

              {/* 역할 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  역할
                </div>
                <div className="flex-1">
                  <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                    {profile.role === 'admin' ? '관리자' : '일반 사용자'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* 마케팅 동의 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">마케팅 수신</div>
                <div className="flex-1">
                  <Badge variant={profile.marketing_agreed ? 'default' : 'outline'}>
                    {profile.marketing_agreed ? '동의' : '미동의'}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* 가입일 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  가입일
                </div>
                <div className="flex-1 font-medium">
                  {new Date(profile.created_at).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 결제 내역 카드 */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>결제 내역</CardTitle>
              <CardDescription>회원권 및 사물함 결제 내역입니다</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-2">아직 결제 내역이 없습니다.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/payment')}
                  >
                    결제하러 가기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div 
                      key={payment.id} 
                      className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{payment.membership_type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {payment.membership_period}개월권
                            {payment.has_locker && ` + 사물함 ${payment.locker_period}개월`}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            payment.status === 'completed' ? 'default' : 
                            payment.status === 'pending' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {payment.status === 'completed' ? '결제완료' : 
                           payment.status === 'pending' ? '대기중' : 
                           payment.status === 'cancelled' ? '취소됨' : '환불됨'}
                        </Badge>
                      </div>
                      
                      <Separator className="my-3" />
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">결제금액</span>
                          <p className="font-semibold mt-1">₩{payment.price.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">결제일시</span>
                          <p className="font-medium mt-1">
                            {new Date(payment.payment_date).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </p>
                        </div>
                        {payment.locker_number && (
                          <div>
                            <span className="text-muted-foreground">사물함 번호</span>
                            <p className="font-medium mt-1">{payment.locker_number}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">처리 상태</span>
                          <p className="font-medium mt-1">
                            {payment.processed ? '처리완료' : '처리대기'}
                          </p>
                        </div>
                      </div>
                      
                      {payment.memo && (
                        <>
                          <Separator className="my-3" />
                          <div className="text-sm">
                            <span className="text-muted-foreground">메모</span>
                            <p className="mt-1">{payment.memo}</p>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 액션 버튼들 */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => router.push('/')}>
              홈으로
            </Button>
            {profile.role === 'admin' && (
              <Button variant="outline" onClick={() => router.push('/admin')}>
                관리자 페이지
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-muted/30 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 GYM29. All rights reserved.</p>
            <div className="flex justify-center gap-6 text-sm">
              <a href="#" className="hover:text-foreground transition-colors">이용약관</a>
              <a href="#" className="hover:text-foreground transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-foreground transition-colors">고객센터</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

