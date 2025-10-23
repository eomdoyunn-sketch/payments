import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 인증 체크
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // URL 파라미터에서 필터 정보 추출
    const { searchParams } = new URL(request.url)
    const company = searchParams.get('company')
    const status = searchParams.get('status')
    const processed = searchParams.get('processed')
    const search = searchParams.get('search')

    // 기본 쿼리 구성
    let query = supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    // 필터 적용
    if (company) {
      query = query.eq('company', company)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (processed !== null && processed !== '') {
      query = query.eq('processed', processed === 'true')
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,employee_id.ilike.%${search}%,company.ilike.%${search}%`)
    }

    const { data: payments, error } = await query

    if (error) {
      console.error('결제 내역 조회 오류:', error)
      return NextResponse.json({ error: '결제 내역을 불러올 수 없습니다.' }, { status: 500 })
    }

    // 통계 계산
    const totalPayments = payments?.length || 0
    const totalAmount = payments?.reduce((sum, payment) => sum + (payment.price || 0), 0) || 0
    const processedPayments = payments?.filter(p => p.processed).length || 0
    const pendingPayments = totalPayments - processedPayments
    const completedPayments = payments?.filter(p => p.status === 'completed').length || 0

    const stats = {
      totalPayments,
      totalAmount,
      processedPayments,
      pendingPayments,
      completedPayments
    }

    return NextResponse.json({
      payments: payments || [],
      stats
    })

  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 인증 체크
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, paymentId, data } = body

    let result

    switch (action) {
      case 'updateProcessed':
        result = await supabase
          .from('payments')
          .update({ processed: data.processed })
          .eq('id', paymentId)
        break

      case 'updateLockerNumber':
        result = await supabase
          .from('payments')
          .update({ locker_number: data.lockerNumber })
          .eq('id', paymentId)
        break

      case 'updateMemo':
        result = await supabase
          .from('payments')
          .update({ memo: data.memo })
          .eq('id', paymentId)
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    if (result.error) {
      console.error('업데이트 오류:', result.error)
      return NextResponse.json({ error: '업데이트에 실패했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

