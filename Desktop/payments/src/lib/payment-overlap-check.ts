import { createClient } from '@/lib/supabase/client'

export interface PaymentOverlapCheck {
  hasOverlap: boolean
  overlappingPayments: Array<{
    id: number
    membershipType: string
    membershipPeriod: number
    membershipStartDate: string
    membershipEndDate: string
    hasLocker: boolean
    lockerPeriod?: number
    lockerStartDate?: string
    lockerEndDate?: string
  }>
  message: string
}

/**
 * 사용자의 기존 결제와 새로운 결제의 이용기간이 겹치는지 확인
 */
export async function checkPaymentOverlap(
  employeeId: string,
  newMembershipType: string,
  newMembershipPeriod: number,
  newHasLocker: boolean,
  newLockerPeriod: number,
  membershipStartDate: string,
  lockerStartDate: string
): Promise<PaymentOverlapCheck> {
  try {
    let supabase
    try {
      supabase = createClient()
    } catch (clientError) {
      console.error('Supabase 클라이언트 생성 실패:', clientError)
      const errorMessage = clientError instanceof Error ? clientError.message : '알 수 없는 오류'
      return {
        hasOverlap: false,
        overlappingPayments: [],
        message: `데이터베이스 연결에 실패했습니다: ${errorMessage}`
      }
    }
    
    // employeeId 유효성 검증
    if (!employeeId || employeeId.trim() === '') {
      console.warn('employeeId가 유효하지 않습니다:', employeeId)
      return {
        hasOverlap: false,
        overlappingPayments: [],
        message: '사용자 정보가 올바르지 않습니다.'
      }
    }

    // 사용자의 기존 결제 내역 조회 (환불되지 않은 것만)
    const { data: existingPayments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('status', 'completed')
      .eq('refunded', false)
      .order('payment_date', { ascending: false })

    if (error) {
      // 에러 객체를 더 명확하게 로깅
      console.warn('기존 결제 내역 조회 실패 (계속 진행):', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        employeeId
      })
      
      // 에러가 있어도 겹침이 없다고 가정하고 결제 진행 가능하게 함
      return {
        hasOverlap: false,
        overlappingPayments: [],
        message: '기존 결제 내역을 확인할 수 없습니다. 계속 진행합니다.'
      }
    }

    if (!existingPayments || existingPayments.length === 0) {
      return {
        hasOverlap: false,
        overlappingPayments: [],
        message: '기존 결제 내역이 없습니다.'
      }
    }

    // 새로운 결제의 이용기간 계산
    const newMembershipEndDate = calculateEndDate(membershipStartDate, newMembershipPeriod)
    const newLockerEndDate = newHasLocker ? calculateEndDate(lockerStartDate, newLockerPeriod) : null

    const overlappingPayments: PaymentOverlapCheck['overlappingPayments'] = []

    // 각 기존 결제와 겹치는지 확인
    for (const payment of existingPayments) {
      // 회원권 이용기간 겹침 확인
      const existingMembershipStart = payment.membership_start_date || membershipStartDate
      const existingMembershipEnd = payment.membership_end_date || calculateEndDate(existingMembershipStart, payment.membership_period)
      
      const membershipOverlap = checkDateOverlap(
        membershipStartDate,
        newMembershipEndDate,
        existingMembershipStart,
        existingMembershipEnd
      )

      // 사물함 이용기간 겹침 확인 (둘 다 사물함이 있는 경우)
      let lockerOverlap = false
      if (newHasLocker && payment.has_locker && newLockerEndDate) {
        const existingLockerStart = payment.locker_start_date || lockerStartDate
        const existingLockerEnd = payment.locker_end_date || calculateEndDate(existingLockerStart, payment.locker_period || 0)
        
        lockerOverlap = checkDateOverlap(
          lockerStartDate,
          newLockerEndDate,
          existingLockerStart,
          existingLockerEnd
        )
      }

      if (membershipOverlap || lockerOverlap) {
        overlappingPayments.push({
          id: payment.id,
          membershipType: payment.membership_type,
          membershipPeriod: payment.membership_period,
          membershipStartDate: existingMembershipStart,
          membershipEndDate: existingMembershipEnd,
          hasLocker: payment.has_locker,
          lockerPeriod: payment.locker_period,
          lockerStartDate: payment.locker_start_date,
          lockerEndDate: payment.locker_end_date
        })
      }
    }

    const hasOverlap = overlappingPayments.length > 0
    let message = ''

    if (hasOverlap) {
      const membershipTypes = [...new Set(overlappingPayments.map(p => p.membershipType))]
      message = `이미 ${membershipTypes.join(', ')} 회원권이 있습니다. 동일한 기간의 회원권은 중복 결제할 수 없습니다.`
    } else {
      message = '이용기간이 겹치지 않습니다. 결제를 진행할 수 있습니다.'
    }

    return {
      hasOverlap,
      overlappingPayments,
      message
    }
  } catch (error) {
    console.error('결제 겹침 확인 오류:', error)
    return {
      hasOverlap: false,
      overlappingPayments: [],
      message: '결제 겹침 확인 중 오류가 발생했습니다.'
    }
  }
}

/**
 * 두 날짜 범위가 겹치는지 확인
 */
function checkDateOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const date1Start = new Date(start1)
  const date1End = new Date(end1)
  const date2Start = new Date(start2)
  const date2End = new Date(end2)

  return date1Start <= date2End && date1End >= date2Start
}

// calculateEndDate 함수는 utils.ts에서 import하여 사용
import { calculateEndDate } from './utils'
