import { createClient } from '@/lib/supabase/server'
import { checkPaymentEligibility } from '@/app/actions/payment-eligibility'
import { getGlobalSettings } from '@/app/actions/settings'
import { HomeClient } from '@/app/HomeClient'
import { redirect } from 'next/navigation'

export default async function Home() {
  // 서버에서 인증 상태 및 결제 자격 확인
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // 관리자 리다이렉트는 미들웨어에서 처리하므로 여기서는 제거
  // if (user) {
  //   const { data: profile } = await supabase
  //     .from('user_profiles')
  //     .select('role')
  //     .eq('id', user.id)
  //     .single()
  //   
  //   if (profile?.role === 'admin') {
  //     redirect('/admin')
  //   }
  // }
  
  const isLoggedIn = !!user
  
  // 로그인한 경우에만 결제 자격 확인
  const eligibility = isLoggedIn ? await checkPaymentEligibility() : null
  
  // 전역 설정 가져오기 (어드민에서 설정한 가격 정보)
  const globalSettings = await getGlobalSettings()
  
  console.log('🏠 서버에서 전역 설정 전달:', {
    membershipPrices: globalSettings.membershipPrices,
    hasGlobalSettings: !!globalSettings
  })
  
  return <HomeClient eligibility={eligibility} isLoggedIn={isLoggedIn} globalSettings={globalSettings} />
}
