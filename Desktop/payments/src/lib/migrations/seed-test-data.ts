import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const testPayments = [
  {
    payment_date: '2025-01-15',
    company: '삼성전자',
    employee_id: 'S001',
    name: '김철수',
    gender: '남',
    membership_type: '3개월 회원권',
    membership_period: 3,
    has_locker: true,
    locker_period: 3,
    locker_number: 'A-101',
    price: 150000,
    status: 'completed',
    processed: true,
    memo: '정상 처리 완료',
    toss_payment_key: 'toss_payment_key_001',
    toss_order_id: 'order_001'
  },
  {
    payment_date: '2025-01-16',
    company: '삼성SDI',
    employee_id: 'SDI001',
    name: '이영희',
    gender: '여',
    membership_type: '6개월 회원권',
    membership_period: 6,
    has_locker: false,
    locker_period: 0,
    locker_number: null,
    price: 280000,
    status: 'completed',
    processed: true,
    memo: '장기 회원',
    toss_payment_key: 'toss_payment_key_002',
    toss_order_id: 'order_002'
  },
  {
    payment_date: '2025-01-17',
    company: '삼성E&A',
    employee_id: 'E001',
    name: '박민수',
    gender: '남',
    membership_type: '1개월 회원권',
    membership_period: 1,
    has_locker: true,
    locker_period: 1,
    locker_number: 'B-205',
    price: 80000,
    status: 'pending',
    processed: false,
    memo: '신규 회원',
    toss_payment_key: 'toss_payment_key_003',
    toss_order_id: 'order_003'
  },
  {
    payment_date: '2025-01-18',
    company: '호텔신라',
    employee_id: 'H001',
    name: '정수진',
    gender: '여',
    membership_type: '12개월 회원권',
    membership_period: 12,
    has_locker: true,
    locker_period: 12,
    locker_number: 'C-301',
    price: 500000,
    status: 'completed',
    processed: true,
    memo: 'VIP 회원',
    toss_payment_key: 'toss_payment_key_004',
    toss_order_id: 'order_004'
  },
  {
    payment_date: '2025-01-19',
    company: '삼성전자',
    employee_id: 'S002',
    name: '최동현',
    gender: '남',
    membership_type: '3개월 회원권',
    membership_period: 3,
    has_locker: true,
    locker_period: 3,
    locker_number: 'A-102',
    price: 150000,
    status: 'cancelled',
    processed: false,
    memo: '결제 취소',
    toss_payment_key: 'toss_payment_key_005',
    toss_order_id: 'order_005'
  }
]

async function seedTestData() {
  try {
    console.log('🌱 테스트 데이터 생성 시작...')
    
    // 기존 데이터 삭제
    console.log('기존 테스트 데이터 삭제 중...')
    await supabase.from('payments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // 테스트 데이터 삽입
    console.log('테스트 데이터 삽입 중...')
    const { data, error } = await supabase
      .from('payments')
      .insert(testPayments)
      .select()
    
    if (error) {
      console.error('테스트 데이터 삽입 실패:', error)
      return false
    }
    
    console.log(`✅ ${data?.length || 0}개의 테스트 결제 데이터가 생성되었습니다.`)
    
    // 통계 출력
    const stats = {
      total: data?.length || 0,
      completed: data?.filter(p => p.status === 'completed').length || 0,
      pending: data?.filter(p => p.status === 'pending').length || 0,
      cancelled: data?.filter(p => p.status === 'cancelled').length || 0,
      processed: data?.filter(p => p.processed).length || 0,
      totalAmount: data?.reduce((sum, p) => sum + p.price, 0) || 0
    }
    
    console.log('\n📊 생성된 데이터 통계:')
    console.log(`- 총 결제 건수: ${stats.total}`)
    console.log(`- 완료된 결제: ${stats.completed}`)
    console.log(`- 대기 중인 결제: ${stats.pending}`)
    console.log(`- 취소된 결제: ${stats.cancelled}`)
    console.log(`- 처리된 결제: ${stats.processed}`)
    console.log(`- 총 결제 금액: ₩${stats.totalAmount.toLocaleString()}`)
    
    return true
  } catch (error) {
    console.error('테스트 데이터 생성 중 오류:', error)
    return false
  }
}

// 스크립트가 직접 실행될 때만 시드 실행
if (require.main === module) {
  seedTestData().then(success => {
    if (success) {
      console.log('🎉 테스트 데이터 생성이 완료되었습니다!')
    } else {
      console.log('❌ 테스트 데이터 생성에 실패했습니다.')
    }
  })
}

export { seedTestData }

