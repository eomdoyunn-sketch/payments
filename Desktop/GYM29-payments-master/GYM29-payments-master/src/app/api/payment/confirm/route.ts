import { NextRequest, NextResponse } from 'next/server'
import { confirmTossPayment } from '@/lib/toss-payments'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentKey, orderId, amount, paymentInfo } = body

    // Supabase 클라이언트 생성
    const supabase = await createClient()

    // 1. 로그인한 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('사용자 인증 실패:', userError)
      return NextResponse.json(
        { success: false, error: '사용자 인증에 실패했습니다.' },
        { status: 401 }
      )
    }

    // 2. 사용자 프로필 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.error('프로필 조회 실패:', profileError)
      return NextResponse.json(
        { success: false, error: '사용자 프로필을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 3. 토스페이먼츠에 결제 승인 요청
    const paymentData = await confirmTossPayment(paymentKey, orderId, amount)

    // 4. Supabase에 결제 내역 저장 (실제 사용자 정보 사용)
    const { data, error } = await supabase
      .from('payments')
      .insert({
        toss_payment_key: paymentKey,
        toss_order_id: orderId,
        price: amount,
        status: 'completed',
        user_id: user.id,  // 사용자 ID 저장
        company: profile.company_name,
        employee_id: profile.employee_id,
        name: profile.name,
        gender: profile.gender || '남',
        membership_type: paymentInfo?.membershipType || '종일권',
        membership_period: paymentInfo?.membershipPeriod || 3,
        has_locker: paymentInfo?.hasLocker || false,
        locker_period: paymentInfo?.lockerPeriod || 0,
        processed: false
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase 저장 오류:', error)
      console.error('에러 상세:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json(
        { 
          success: false, 
          error: `결제 내역 저장 실패: ${error.message}` 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      ...paymentData,
      paymentId: data.id
    })
  } catch (error: any) {
    console.error('결제 승인 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '결제 승인 실패' 
      },
      { status: 500 }
    )
  }
}


