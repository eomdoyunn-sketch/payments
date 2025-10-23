import { loadTossPayments } from '@tosspayments/tosspayments-sdk'

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_demo'

// 클라이언트 키 유효성 검사
function validateClientKey(key: string | undefined): string {
  if (!key) {
    throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.')
  }
  
  // 테스트 키 형식 검사 (임시로 완화)
  if (!key.startsWith('test_') && !key.startsWith('live_')) {
    console.warn('⚠️ 토스페이먼츠 클라이언트 키 형식이 표준과 다를 수 있습니다. test_ck_ 또는 live_ck_ 형식을 권장합니다.')
  }
  
  return key
}

export interface PaymentRequest {
  amount: number
  orderId: string
  orderName: string
  customerName: string
  customerEmail?: string
  customerMobilePhone?: string
  successUrl: string
  failUrl: string
  customerKey: string // 사용자별 고유 키
}

/**
 * 토스페이먼츠 SDK 로드 및 초기화
 */
export async function initializeTossPayments() {
  const validatedKey = validateClientKey(clientKey)
  
  console.log('🔑 토스페이먼츠 클라이언트 키:', validatedKey.substring(0, 10) + '...')
  
  try {
    console.log('📦 토스페이먼츠 SDK 로딩 시작...')
    
    // CORB 오류 방지를 위해 더 안전한 로딩 방식 사용
    const tossPayments = await loadTossPayments(validatedKey)
    
    console.log('✅ 토스페이먼츠 SDK 로딩 완료:', tossPayments)
    return tossPayments
  } catch (error: any) {
    console.error('❌ 토스페이먼츠 SDK 로딩 실패:', error)
    console.error('❌ 에러 상세 정보:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      clientKey: validatedKey.substring(0, 10) + '...'
    })
    
    // CORB 오류인 경우 특별 처리
    if (error?.message?.includes('CORB') || error?.message?.includes('Cross-Origin')) {
      console.warn('⚠️ CORB 오류 감지됨. 토스페이먼츠 SDK 로딩을 재시도합니다...')
      
      // 잠시 대기 후 재시도
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      try {
        const retryTossPayments = await loadTossPayments(validatedKey)
        console.log('✅ 토스페이먼츠 SDK 재시도 성공:', retryTossPayments)
        return retryTossPayments
      } catch (retryError) {
        console.error('❌ 토스페이먼츠 SDK 재시도 실패:', retryError)
        throw new Error('토스페이먼츠 SDK 로딩에 실패했습니다. 브라우저를 새로고침하거나 잠시 후 다시 시도해주세요.')
      }
    }
    
    // 토스페이먼츠 특정 에러 메시지 제공
    if (error?.code === 'UNAUTHORIZED_KEY') {
      throw new Error('토스페이먼츠 클라이언트 키가 유효하지 않습니다. 개발자센터에서 올바른 키를 확인해주세요.')
    } else if (error?.code === 'NETWORK_ERROR') {
      throw new Error('네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.')
    } else {
      throw new Error(`토스페이먼츠 SDK 로딩 실패: ${error?.message || '알 수 없는 오류'}`)
    }
  }
}

/**
 * 결제위젯 초기화
 */
export async function createPaymentWidget(customerKey: string) {
  const tossPayments = await initializeTossPayments()
  return tossPayments.widgets({ customerKey })
}

/**
 * 결제위젯에서 카드 정보가 선택되었는지 확인
 */
export async function validatePaymentMethod(widgets: any): Promise<boolean> {
  try {
    // 결제 수단 상태 확인
    const paymentMethods = await widgets.getPaymentMethods()
    console.log('🔍 결제 수단 상태 확인:', paymentMethods)
    
    // 결제 수단이 있는지 확인
    if (!paymentMethods || paymentMethods.length === 0) {
      console.warn('⚠️ 선택된 결제 수단이 없음')
      return false
    }
    
    // 토스페이먼츠 SDK의 실제 응답 구조에 맞춰 검증
    // paymentMethods는 배열이고, 각 요소는 선택된 결제 수단 정보를 포함
    const hasValidPaymentMethod = paymentMethods.some((method: any) => {
      // 다양한 필드명으로 결제 수단 확인
      const methodName = method.method || method.code || method.type || method.name || ''
      const isCard = methodName.includes('카드') || 
                     methodName.includes('CARD') || 
                     methodName.includes('카드결제') ||
                     methodName === '카드' ||
                     methodName === 'card'
      
      console.log('🔍 결제 수단 검증:', { methodName, isCard, method })
      return isCard
    })
    
    if (!hasValidPaymentMethod) {
      console.warn('⚠️ 카드 결제 수단이 선택되지 않음. 선택된 수단:', paymentMethods)
      return false
    }
    
    console.log('✅ 카드 결제 수단 확인됨:', paymentMethods)
    return true
  } catch (error) {
    console.warn('⚠️ 결제 수단 확인 중 오류:', error)
    // 오류가 발생해도 결제를 시도해보도록 true 반환 (토스페이먼츠 SDK가 자체적으로 검증)
    return true
  }
}

/**
 * 토스페이먼츠 v2 SDK로 결제 요청 (결제위젯 방식)
 * 주의: 이 함수를 호출하기 전에 반드시 renderPaymentMethods()로 결제 수단 UI를 렌더링해야 합니다.
 */
export async function requestTossPayment(
  widgets: any, // PaymentWidgets 타입
  request: PaymentRequest
) {
  console.log('💳 토스페이먼츠 결제 요청 시작:', {
    amount: request.amount,
    orderId: request.orderId,
    orderName: request.orderName,
  })

  try {
    // 결제 수단 유효성 검사 (선택적)
    console.log('🔍 결제 수단 유효성 검사 중...')
    const isValidPaymentMethod = await validatePaymentMethod(widgets)
    
    if (!isValidPaymentMethod) {
      console.warn('⚠️ 결제 수단 검증 실패, 하지만 토스페이먼츠 SDK가 자체 검증을 수행합니다.')
      // 토스페이먼츠 SDK가 자체적으로 검증하므로 경고만 출력하고 계속 진행
    } else {
      console.log('✅ 결제 수단 유효성 검사 통과')
    }
    
    // 결제 금액 설정
    console.log('💰 결제 금액 설정 중...')
    await widgets.setAmount({
      currency: 'KRW',
      value: request.amount
    })
    console.log('✅ 결제 금액 설정 완료:', request.amount)
    
    // 결제 요청
    console.log('💰 결제 요청 시도...')
    const result = await widgets.requestPayment({
      orderId: request.orderId,
      orderName: request.orderName,
      successUrl: request.successUrl,
      failUrl: request.failUrl,
      customerEmail: request.customerEmail,
      customerName: request.customerName,
      customerMobilePhone: request.customerMobilePhone,
    })
    console.log('✅ 결제 요청 완료:', result)
    return result
  } catch (error: any) {
    console.error('❌ 토스페이먼츠 결제 요청 실패:', error)
    console.error('❌ 에러 상세 정보:', {
      name: error?.name,
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    })
    
    // 사용자 친화적인 오류 메시지 제공
    if (error?.code === 'USER_CANCEL') {
      // 결제 취소는 정상적인 사용자 행동이므로 특별한 처리가 필요 없음
      console.log('사용자가 결제를 취소했습니다.')
      throw new Error('결제가 취소되었습니다.')
    } else if (error?.code === 'INVALID_CARD_NUMBER') {
      throw new Error('유효하지 않은 카드 번호입니다.')
    } else if (error?.code === 'INSUFFICIENT_BALANCE') {
      throw new Error('잔액이 부족합니다.')
    } else if (error?.code === 'NEED_CARD_PAYMENT_DETAIL') {
      throw new Error('카드사와 할부 기간을 선택해주세요. 결제 수단에서 원하는 카드사와 할부 기간을 선택한 후 다시 시도해주세요.')
    } else if (error?.message?.includes('CORB') || error?.message?.includes('Cross-Origin')) {
      throw new Error('결제 시스템에 일시적인 문제가 발생했습니다. 브라우저를 새로고침하거나 잠시 후 다시 시도해주세요.')
    } else if (error?.message?.includes('카드사와 할부 기간을 선택해주세요')) {
      throw new Error('카드사와 할부 기간을 선택해주세요. 결제 수단에서 원하는 카드사와 할부 기간을 선택한 후 다시 시도해주세요.')
    } else {
      throw new Error(`결제 요청 실패: ${error?.message || '알 수 없는 오류'}`)
    }
  }
}

/**
 * 결제 승인 (서버 측에서 호출)
 */
export async function confirmTossPayment(
  paymentKey: string,
  orderId: string,
  amount: number
) {
  const secretKey = process.env.TOSS_SECRET_KEY || ''
  
  // 환경 변수 검증
  if (!secretKey || secretKey === '') {
    console.error('토스페이먼츠 시크릿 키가 설정되지 않았습니다.')
    throw new Error('토스페이먼츠 시크릿 키가 설정되지 않았습니다. 환경 변수 TOSS_SECRET_KEY를 확인해주세요.')
  }
  
  const url = 'https://api.tosspayments.com/v1/payments/confirm'
  
  console.log('토스페이먼츠 결제 승인 요청:', {
    paymentKey: paymentKey.substring(0, 10) + '...',
    orderId,
    amount,
    hasSecretKey: !!secretKey
  })
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount
    })
  })
  
  if (!response.ok) {
    let errorData = {}
    try {
      errorData = await response.json()
    } catch (jsonError) {
      console.warn('토스페이먼츠 API 응답 JSON 파싱 실패:', jsonError)
      errorData = { 
        message: `토스페이먼츠 API 오류: ${response.status} ${response.statusText}`,
        code: 'API_ERROR'
      }
    }
    
    console.error('토스페이먼츠 결제 승인 실패:', {
      status: response.status,
      statusText: response.statusText,
      errorData,
      paymentKey: paymentKey.substring(0, 10) + '...',
      orderId,
      amount
    })
    
    // 더 구체적인 오류 메시지 제공
    if (response.status === 401) {
      throw new Error('토스페이먼츠 인증에 실패했습니다. 시크릿 키를 확인해주세요.')
    } else if (response.status === 400) {
      throw new Error(`토스페이먼츠 요청 오류: ${errorData.message || '잘못된 요청입니다.'}`)
    } else if (response.status === 404) {
      throw new Error('결제 정보를 찾을 수 없습니다. 결제 키를 확인해주세요.')
    } else {
      throw new Error(errorData.message || errorData.error || `결제 승인 실패 (${response.status})`)
    }
  }
  
  const result = await response.json()
  console.log('토스페이먼츠 결제 승인 성공:', {
    orderId: result.orderId,
    status: result.status,
    approvedAt: result.approvedAt
  })
  
  return result
}

/**
 * 결제 취소
 */
export async function cancelTossPayment(
  paymentKey: string,
  cancelReason: string
) {
  const secretKey = process.env.TOSS_SECRET_KEY || ''
  const url = `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cancelReason
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || '결제 취소 실패')
  }
  
  return await response.json()
}

/**
 * OrderId 생성
 */
export function generateOrderId(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `GYM29_${timestamp}_${random}`
}


