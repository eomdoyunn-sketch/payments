'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// =====================================================
// Payments 관리 Server Actions
// =====================================================

export type Payment = {
  id: string
  payment_date: string
  company: string
  employee_id: string
  name: string
  gender: '남' | '여'
  membership_type: string
  membership_period: number
  has_locker: boolean
  locker_period: number
  locker_number?: string
  price: number
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  processed: boolean
  memo?: string
  toss_payment_key?: string
  toss_order_id?: string
  created_at: string
  updated_at: string
}

// 인증 체크 헬퍼 함수 (권한 체크 제거)
async function checkAuthentication() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('인증이 필요합니다')

  return { supabase, user }
}

// 모든 결제 내역 조회
export async function getAllPayments(): Promise<Payment[]> {
  try {
    const { supabase } = await checkAuthentication()

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false })

    if (error) {
      console.error('Error fetching payments:', error)
      throw new Error('결제 내역 조회에 실패했습니다')
    }

    return payments || []
  } catch (error) {
    console.error('getAllPayments error:', error)
    // 테이블이 없는 경우 빈 배열 반환
    return []
  }
}

// 결제 내역 필터링 조회
export async function getPaymentsByFilter(filters: {
  company?: string
  status?: string
  processed?: boolean
  startDate?: string
  endDate?: string
}): Promise<Payment[]> {
  try {
    const { supabase } = await checkAuthentication()

    let query = supabase.from('payments').select('*')

    if (filters.company) query = query.eq('company', filters.company)
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.processed !== undefined) query = query.eq('processed', filters.processed)
    if (filters.startDate) query = query.gte('payment_date', filters.startDate)
    if (filters.endDate) query = query.lte('payment_date', filters.endDate)

    const { data, error } = await query.order('payment_date', { ascending: false })

    if (error) {
      console.error('Error filtering payments:', error)
      throw new Error('결제 내역 필터링에 실패했습니다')
    }

    return data || []
  } catch (error) {
    console.error('getPaymentsByFilter error:', error)
    return []
  }
}

// 결제 처리 상태 변경 (단일 또는 다중)
export async function updatePaymentProcessed(
  paymentIds: string[],
  processed: boolean
) {
  try {
    const { supabase } = await checkAuthentication()

    const { error } = await supabase
      .from('payments')
      .update({ processed })
      .in('id', paymentIds)

    if (error) {
      console.error('Error updating payment processed status:', error)
      throw new Error('결제 처리 상태 변경에 실패했습니다')
    }

    revalidatePath('/admin')
    return { success: true, count: paymentIds.length }
  } catch (error) {
    console.error('updatePaymentProcessed error:', error)
    throw error
  }
}

// 결제 처리 상태 토글 (단일)
export async function togglePaymentProcessed(paymentId: string) {
  try {
    const { supabase } = await checkAuthentication()

    // 현재 상태 조회
    const { data: payment } = await supabase
      .from('payments')
      .select('processed')
      .eq('id', paymentId)
      .single()

    if (!payment) {
      throw new Error('결제 정보를 찾을 수 없습니다')
    }

    // 상태 토글
    const { data, error } = await supabase
      .from('payments')
      .update({ processed: !payment.processed })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) {
      console.error('Error toggling payment processed status:', error)
      throw new Error('결제 처리 상태 토글에 실패했습니다')
    }

    revalidatePath('/admin')
    return data
  } catch (error) {
    console.error('togglePaymentProcessed error:', error)
    throw error
  }
}

// 사물함 번호 업데이트
export async function updateLockerNumber(paymentId: string, lockerNumber: string) {
  try {
    const { supabase } = await checkAuthentication()

    const { data, error } = await supabase
      .from('payments')
      .update({ locker_number: lockerNumber })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) {
      console.error('Error updating locker number:', error)
      throw new Error('사물함 번호 업데이트에 실패했습니다')
    }

    revalidatePath('/admin')
    return data
  } catch (error) {
    console.error('updateLockerNumber error:', error)
    throw error
  }
}

// 메모 업데이트
export async function updatePaymentMemo(paymentId: string, memo: string) {
  try {
    const { supabase } = await checkAuthentication()

    const { data, error } = await supabase
      .from('payments')
      .update({ memo })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) {
      console.error('Error updating payment memo:', error)
      throw new Error('메모 업데이트에 실패했습니다')
    }

    revalidatePath('/admin')
    return data
  } catch (error) {
    console.error('updatePaymentMemo error:', error)
    throw error
  }
}

// 결제 통계 조회
export async function getPaymentStats() {
  try {
    const { supabase } = await checkAuthentication()

    const { data: payments, error } = await supabase
      .from('payments')
      .select('price, status, processed')

    if (error) {
      console.error('Error fetching payment stats:', error)
      throw new Error('결제 통계 조회에 실패했습니다')
    }

    const stats = {
      totalPayments: payments?.length || 0,
      totalAmount: payments?.reduce((sum, p) => sum + p.price, 0) || 0,
      processedPayments: payments?.filter(p => p.processed).length || 0,
      pendingPayments: payments?.filter(p => !p.processed).length || 0,
      completedPayments: payments?.filter(p => p.status === 'completed').length || 0,
    }

    return stats
  } catch (error) {
    console.error('getPaymentStats error:', error)
    // 테이블이 없는 경우 기본값 반환
    return {
      totalPayments: 0,
      totalAmount: 0,
      processedPayments: 0,
      pendingPayments: 0,
      completedPayments: 0,
    }
  }
}

// 결제 상태 변경
export async function updatePaymentStatus(
  paymentId: string,
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
) {
  try {
    const { supabase } = await checkAuthentication()

    const { data, error } = await supabase
      .from('payments')
      .update({ status })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) {
      console.error('Error updating payment status:', error)
      throw new Error('결제 상태 변경에 실패했습니다')
    }

    revalidatePath('/admin')
    return data
  } catch (error) {
    console.error('updatePaymentStatus error:', error)
    throw error
  }
}

// 결제 삭제 (환불된 경우에만)
export async function deletePayment(paymentId: string) {
  try {
    const { supabase } = await checkAuthentication()

    // 결제 상태 확인
    const { data: payment } = await supabase
      .from('payments')
      .select('status')
      .eq('id', paymentId)
      .single()

    if (!payment) {
      throw new Error('결제 정보를 찾을 수 없습니다')
    }

    if (payment.status !== 'refunded' && payment.status !== 'cancelled') {
      throw new Error('환불 또는 취소된 결제만 삭제할 수 있습니다')
    }

    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', paymentId)

    if (error) {
      console.error('Error deleting payment:', error)
      throw new Error('결제 삭제에 실패했습니다')
    }

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('deletePayment error:', error)
    throw error
  }
}

// 계열사별 결제 통계
export async function getPaymentStatsByCompany(companyCode: string) {
  try {
    const { supabase } = await checkAuthentication()

    const { data: payments, error } = await supabase
      .from('payments')
      .select('price, status, processed, membership_type')
      .eq('company', companyCode)

    if (error) {
      console.error('Error fetching company payment stats:', error)
      throw new Error('계열사별 결제 통계 조회에 실패했습니다')
    }

    const stats = {
      totalPayments: payments?.length || 0,
      totalAmount: payments?.reduce((sum, p) => sum + p.price, 0) || 0,
      fullDayCount: payments?.filter(p => p.membership_type === '종일권').length || 0,
      morningCount: payments?.filter(p => p.membership_type === '오전권').length || 0,
      eveningCount: payments?.filter(p => p.membership_type === '저녁권').length || 0,
      processedCount: payments?.filter(p => p.processed).length || 0,
    }

    return stats
  } catch (error) {
    console.error('getPaymentStatsByCompany error:', error)
    return {
      totalPayments: 0,
      totalAmount: 0,
      fullDayCount: 0,
      morningCount: 0,
      eveningCount: 0,
      processedCount: 0,
    }
  }
}

