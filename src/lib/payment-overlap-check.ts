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
    const supabase = createClient()
    
    // 사용자의 기존 결제 내역 조회 (환불되지 않은 것만)
    const { data: existingPayments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('employee_id', employeeId)
      .eq('status', 'completed')
      .eq('refunded', false)
      .order('payment_date', { ascending: false })

    if (error) {
      console.error('기존 결제 내역 조회 실패:', error)
      return {
        hasOverlap: false,
        overlappingPayments: [],
        message: '기존 결제 내역을 확인할 수 없습니다.'
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

/**
 * 시작 날짜에서 개월을 더한 종료 날짜를 계산
 */
function calculateEndDate(startDate: string, months: number): string {
  const start = new Date(startDate)
  const end = new Date(start)
  end.setMonth(start.getMonth() + months)
  end.setDate(end.getDate() - 1)
  return end.toISOString().split('T')[0]
}
