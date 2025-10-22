import { createClient } from '@/lib/supabase/server'
import { checkPaymentEligibility } from '@/app/actions/payment-eligibility'
import { getGlobalSettings } from '@/app/actions/settings'
import { HomeClient } from '@/app/HomeClient'
import { redirect } from 'next/navigation'

export default async function Home() {
  // Supabase URL이 유효하지 않은 경우 기본값으로 처리
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const isSupabaseConfigured = supabaseUrl && 
    supabaseAnonKey &&
    supabaseUrl !== 'your_supabase_project_url' && 
    supabaseUrl !== 'https://dummy.supabase.co' &&
    supabaseAnonKey !== 'your_supabase_anon_key' &&
    supabaseAnonKey !== 'dummy-key'

  let user = null
  let isLoggedIn = false
  let eligibility = null

  if (isSupabaseConfigured) {
    try {
      // Supabase 클라이언트 생성 시도
      let supabase
      try {
        supabase = await createClient()
      } catch (clientError) {
        console.log('📊 Supabase 클라이언트 생성 실패, 기본값 사용:', clientError)
        // 클라이언트 생성 실패 시 기본값으로 처리
      }

      if (supabase) {
        // 서버에서 인증 상태 및 결제 자격 확인
        const { data: { user: authUser } } = await supabase.auth.getUser()
        user = authUser
        
        // 관리자는 /admin으로 리다이렉트
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          
          if (profile?.role === 'admin') {
            redirect('/admin')
          }
        }
        
        isLoggedIn = !!user
        
        // 로그인한 경우에만 결제 자격 확인
        eligibility = isLoggedIn ? await checkPaymentEligibility() : null
      }
    } catch (error) {
      console.error('Supabase 연결 오류:', error)
      // 오류 발생 시 기본값 사용
    }
  }
  
  // 전역 설정 가져오기 (어드민에서 설정한 가격 정보)
  const globalSettings = await getGlobalSettings()
  
  console.log('🏠 서버에서 전역 설정 전달:', {
    membershipPrices: globalSettings.membershipPrices,
    hasGlobalSettings: !!globalSettings
  })
  
  return <HomeClient eligibility={eligibility} isLoggedIn={isLoggedIn} globalSettings={globalSettings} />
}
