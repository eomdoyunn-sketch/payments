import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 인증 체크
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'excel'
    const type = searchParams.get('type') || 'payments'

    // 결제 데이터 조회
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('데이터 조회 오류:', error)
      return NextResponse.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }

    // 데이터 변환
    const exportData = payments?.map(payment => ({
      '결제 ID': payment.id,
      '결제일': payment.payment_date,
      '회사': payment.company,
      '사번': payment.employee_id,
      '이름': payment.name,
      '성별': payment.gender,
      '회원권 종류': payment.membership_type,
      '회원권 기간': `${payment.membership_period}개월`,
      '사물함 여부': payment.has_locker ? '있음' : '없음',
      '사물함 기간': payment.has_locker ? `${payment.locker_period}개월` : '-',
      '사물함 번호': payment.locker_number || '-',
      '결제 금액': payment.price,
      '결제 상태': payment.status,
      '처리 상태': payment.processed ? '처리완료' : '미처리',
      '메모': payment.memo || '-',
      '토스 결제키': payment.toss_payment_key || '-',
      '토스 주문ID': payment.toss_order_id || '-',
      '생성일': payment.created_at,
      '수정일': payment.updated_at
    })) || []

    if (format === 'excel') {
      // Excel 파일 생성
      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, '결제내역')
      
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
      
      return new NextResponse(excelBuffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="gym29-payments-${new Date().toISOString().split('T')[0]}.xlsx"`
        }
      })
    }

    if (format === 'csv') {
      // CSV 파일 생성
      const csvContent = [
        Object.keys(exportData[0] || {}).join(','),
        ...exportData.map(row => Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(','))
      ].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="gym29-payments-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }

    if (format === 'json') {
      // JSON 파일 반환
      return new NextResponse(JSON.stringify(exportData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="gym29-payments-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })

  } catch (error) {
    console.error('내보내기 오류:', error)
    return NextResponse.json({ error: '내보내기에 실패했습니다.' }, { status: 500 })
  }
}

