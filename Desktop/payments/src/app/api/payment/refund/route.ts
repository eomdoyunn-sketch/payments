import { NextRequest, NextResponse } from 'next/server'
import { cancelTossPayment } from '@/lib/toss-payments'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentId, reason } = body

    // 필수 파라미터 검증
    if (!paymentId || !reason) {
      return NextResponse.json(
        { success: false, error: '필수 정보가 누락되었습니다.' },
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

    // 2. 결제 정보 조회
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (paymentError || !payment) {
      console.error('결제 정보 조회 실패:', paymentError)
      return NextResponse.json(
        { success: false, error: '결제 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 3. 이미 환불된 결제인지 확인
    if (payment.refunded) {
      return NextResponse.json(
        { success: false, error: '이미 환불된 결제입니다.' },
        { status: 400 }
      )
    }

    // 4. 토스페이먼츠 환불 요청
    let refundData
    try {
      console.log('토스페이먼츠 환불 요청:', {
        paymentKey: payment.toss_payment_key?.substring(0, 10) + '...',
        reason
      })
      
      refundData = await cancelTossPayment(payment.toss_payment_key, reason)
      
      console.log('토스페이먼츠 환불 성공:', {
        cancelAmount: refundData.cancelAmount,
        cancelReason: refundData.cancelReason
      })
    } catch (tossError: any) {
      console.error('토스페이먼츠 환불 실패:', tossError)
      
      // 토스페이먼츠 API 오류를 구체적으로 처리
      if (tossError.message?.includes('이미 취소된 결제')) {
        return NextResponse.json(
          { 
            success: false, 
            error: '이미 취소된 결제입니다.',
            details: tossError.message
          },
          { status: 400 }
        )
      } else if (tossError.message?.includes('환불 가능한 금액이 없습니다')) {
        return NextResponse.json(
          { 
            success: false, 
            error: '환불 가능한 금액이 없습니다.',
            details: tossError.message
          },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: `토스페이먼츠 환불 오류: ${tossError.message || '알 수 없는 오류'}`,
            details: tossError.message
          },
          { status: 500 }
        )
      }
    }

    // 5. Supabase에 환불 정보 업데이트
    const currentDate = new Date().toISOString().split('T')[0]
    
    const { data: updatedPayment, error: updateError } = await supabase
      .from('payments')
      .update({
        refunded: true,
        refund_date: currentDate,
        refund_reason: reason,
        status: 'cancelled'
      })
      .eq('id', paymentId)
      .select()
      .single()

    if (updateError) {
      console.error('환불 정보 업데이트 실패:', updateError)
      return NextResponse.json(
        { 
          success: false, 
          error: `환불 정보 저장 실패: ${updateError.message}` 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '환불이 완료되었습니다.',
      refundData: {
        cancelAmount: refundData.cancelAmount,
        cancelReason: refundData.cancelReason,
        refundDate: currentDate
      },
      paymentId: updatedPayment.id
    })
  } catch (error: any) {
    console.error('환불 처리 오류:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || '환불 처리 실패' 
      },
      { status: 500 }
    )
  }
}
