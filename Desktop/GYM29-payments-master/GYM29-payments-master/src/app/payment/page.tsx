"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { PaymentsCard } from "@/components/PaymentsCard"
import { Header } from "@/components/Header"
import { supabase } from "@/lib/supabase"

export default function PaymentPage() {
  const router = useRouter()
  const [user, setUser] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/login')
          return
        }

        // 사용자 프로필 가져오기
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setUser({
            id: profile.id,
            companyId: profile.company_id,
            empNo: profile.emp_no,
            name: profile.name,
            email: session.user.email,
            phone: profile.phone
          })
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // 예시 데이터 (실제로는 서버에서 가져와야 함)
  const company = {
    id: user.companyId,
    name: "한화그룹",
    quota: 100,
    registered: 45,
    remaining: 55,
    mode: "FCFS" as const,
    status: "active" as const,  // 계열사 활성 상태
    availableFrom: new Date('2025-01-01'),
    availableUntil: new Date('2025-12-31')
  }

  const products = [
    {
      id: "1",
      name: "종일권",
      period: "6개월",
      price: 300000,
      remaining: 20,
      startDate: "2025-01-01",
      endDate: "2025-06-30"
    },
    {
      id: "2",
      name: "오전권",
      period: "6개월",
      price: 200000,
      remaining: 15,
      startDate: "2025-01-01",
      endDate: "2025-06-30"
    },
    {
      id: "3",
      name: "야간권",
      period: "6개월",
      price: 200000,
      remaining: 15,
      startDate: "2025-01-01",
      endDate: "2025-06-30"
    }
  ]

  const agreements = [
    {
      type: "personal" as const,
      title: "개인정보 수집 및 이용 동의",
      version: "v1.0",
      url: "#"
    },
    {
      type: "sensitive" as const,
      title: "민감정보 처리 동의",
      version: "v1.0",
      url: "#"
    },
    {
      type: "utilization" as const,
      title: "개인정보 제3자 제공 동의",
      version: "v1.0",
      url: "#"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">회원권 결제</h1>
            <p className="text-muted-foreground">
              원하시는 회원권을 선택하고 결제를 진행해주세요
            </p>
          </div>

          <PaymentsCard
            user={user}
            company={company}
            products={products}
            agreements={agreements}
          />
        </div>
      </main>
    </div>
  )
}

