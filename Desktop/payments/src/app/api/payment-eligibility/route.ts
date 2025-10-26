import { NextResponse } from 'next/server'
import { checkPaymentEligibility } from '@/app/actions/payment-eligibility'

export async function GET() {
  try {
    const result = await checkPaymentEligibility()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ eligible: false, reason: '결제 자격 확인 중 오류가 발생했습니다.' }, { status: 500 })
  }
}


