import { NextRequest, NextResponse } from 'next/server'
import { confirmTossPayment } from '@/lib/toss-payments'
import { createClient } from '@/lib/supabase/server'
import { calculateEndDate } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentKey, orderId, amount, paymentInfo } = body

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { success: false, error: '필수 결제 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

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
    let paymentData
    try {
      paymentData = await confirmTossPayment(paymentKey, orderId, amount)
    } catch (tossError: any) {
      console.error('토스페이먼츠 결제 승인 실패:', tossError)
      
      // 토스페이먼츠 API 오류를 구체적으로 처리
      if (tossError.message?.includes('시크릿 키가 설정되지 않았습니다')) {
        return NextResponse.json(
          { 
            success: false, 
            error: '결제 시스템 설정에 문제가 있습니다. 관리자에게 문의해주세요.',
            details: 'TOSS_SECRET_KEY 환경 변수가 설정되지 않았습니다.'
          },
          { status: 500 }
        )
      } else if (tossError.message?.includes('토스페이먼츠 인증에 실패')) {
        return NextResponse.json(
          { 
            success: false, 
            error: '결제 시스템 인증에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
            details: tossError.message
          },
          { status: 401 }
        )
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: `토스페이먼츠 API 오류: ${tossError.message || '알 수 없는 오류'}`,
            details: tossError.message
          },
          { status: 500 }
        )
      }
    }

    // 4. 전역 설정 가져오기
    const { data: settings } = await supabase
      .from('global_settings')
      .select('*')
      .single()

    // 5. 이용기간 계산
    const membershipStartDate = settings?.membershipStartDate || '2025-01-01'
    const membershipPeriod = paymentInfo?.membershipPeriod || 3
    const membershipEndDate = calculateEndDate(membershipStartDate, membershipPeriod)
    
    const lockerStartDate = settings?.lockerStartDate || '2025-01-01'
    const lockerPeriod = paymentInfo?.lockerPeriod || 0
    const lockerEndDate = paymentInfo?.hasLocker ? calculateEndDate(lockerStartDate, lockerPeriod) : null

    // 5. Supabase에 결제 내역 저장 (실제 사용자 정보 사용)
    const { data, error } = await supabase
      .from('payments')
      .insert({
        toss_payment_key: paymentKey,
        toss_order_id: orderId,
        price: amount,
        status: 'completed',
        // user_id 컬럼이 없을 수 있으므로 제거하고 다른 필드로 사용자 식별
        company: profile.company_name,
        employee_id: profile.employee_id,
        name: profile.name,
        gender: profile.gender || '남',
        membership_type: paymentInfo?.membershipType || '종일권',
        membership_period: membershipPeriod,
        has_locker: paymentInfo?.hasLocker || false,
        locker_period: lockerPeriod,
        processed: false,
        refunded: false, // 환불 상태 초기화
        // 이용기간 정보 추가
        membership_start_date: membershipStartDate,
        membership_end_date: membershipEndDate,
        locker_start_date: paymentInfo?.hasLocker ? lockerStartDate : null,
        locker_end_date: lockerEndDate
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
      
      // 데이터베이스 스키마 오류인 경우 특별 처리
      if (error.message?.includes('column') && error.message?.includes('schema cache')) {
        return NextResponse.json(
          { 
            success: false, 
            error: '데이터베이스 스키마 오류가 발생했습니다. 관리자에게 문의해주세요.',
            details: error.message
          },
          { status: 500 }
        )
      }
      
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


