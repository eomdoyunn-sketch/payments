'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CreditCard, Smartphone, MapPin, Calendar, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'

interface CheckoutItem {
  id: string
  name: string
  brand: string
  model: string
  image: string
  price: number
  quantity: number
  color: string
  capacity: string
  type: string
}

interface DeliveryInfo {
  name: string
  phone: string
  address: string
  detailAddress: string
  zipCode: string
  deliveryRequest: string
}

interface InstallationInfo {
  address: string
  date: string
  time: string
  location: string
  wallType: string
  powerSupply: string
  drainage: string
}

const mockCheckoutItems: CheckoutItem[] = [
  {
    id: '1',
    name: '삼성 인버터 벽걸이형 에어컨',
    brand: '삼성',
    model: 'AR12T9170HZ',
    image: '/api/placeholder/100/100',
    price: 850000,
    quantity: 1,
    color: '화이트',
    capacity: '3.5kW',
    type: '벽걸이형'
  }
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    zipCode: '',
    deliveryRequest: ''
  })
  const [installationInfo, setInstallationInfo] = useState<InstallationInfo>({
    address: '',
    date: '',
    time: '',
    location: '',
    wallType: '',
    powerSupply: '',
    drainage: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    holder: ''
  })

  const steps = [
    { id: 1, title: '배송 정보', icon: MapPin },
    { id: 2, title: '설치 정보', icon: Calendar },
    { id: 3, title: '결제 정보', icon: CreditCard },
    { id: 4, title: '주문 완료', icon: Check }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const subtotal = mockCheckoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingFee = 0 // 무료 배송
  const installationFee = 0 // 무료 설치
  const totalAmount = subtotal + shippingFee + installationFee

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">배송 정보</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  받는 사람 이름 *
                </label>
                <Input
                  value={deliveryInfo.name}
                  onChange={(e) => setDeliveryInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연락처 *
                </label>
                <Input
                  value={deliveryInfo.phone}
                  onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 *
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={deliveryInfo.zipCode}
                  onChange={(e) => setDeliveryInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="우편번호"
                  className="w-32"
                />
                <Button variant="outline">주소 검색</Button>
              </div>
              <Input
                value={deliveryInfo.address}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                placeholder="기본 주소"
                className="mb-2"
              />
              <Input
                value={deliveryInfo.detailAddress}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, detailAddress: e.target.value }))}
                placeholder="상세 주소"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배송 요청사항
              </label>
              <Input
                value={deliveryInfo.deliveryRequest}
                onChange={(e) => setDeliveryInfo(prev => ({ ...prev, deliveryRequest: e.target.value }))}
                placeholder="배송 시 요청사항을 입력하세요"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">설치 정보</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설치 주소
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="sameAddress"
                  defaultChecked
                  className="w-4 h-4"
                />
                <span>배송지와 동일</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sameAddress"
                  className="w-4 h-4"
                />
                <span>다른 주소</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  희망 설치일 *
                </label>
                <Input
                  type="date"
                  value={installationInfo.date}
                  onChange={(e) => setInstallationInfo(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시간대 *
                </label>
                <select
                  value={installationInfo.time}
                  onChange={(e) => setInstallationInfo(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">시간대 선택</option>
                  <option value="morning">오전 (9:00-12:00)</option>
                  <option value="afternoon">오후 (13:00-18:00)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설치 위치 *
              </label>
              <select
                value={installationInfo.location}
                onChange={(e) => setInstallationInfo(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">위치 선택</option>
                <option value="living">거실</option>
                <option value="bedroom">침실</option>
                <option value="office">사무실</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  벽면 재질
                </label>
                <select
                  value={installationInfo.wallType}
                  onChange={(e) => setInstallationInfo(prev => ({ ...prev, wallType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">재질 선택</option>
                  <option value="concrete">콘크리트</option>
                  <option value="wood">목재</option>
                  <option value="brick">벽돌</option>
                  <option value="other">기타</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전원 공급
                </label>
                <select
                  value={installationInfo.powerSupply}
                  onChange={(e) => setInstallationInfo(prev => ({ ...prev, powerSupply: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">상태 선택</option>
                  <option value="available">가능</option>
                  <option value="unavailable">불가능</option>
                  <option value="unknown">확인 필요</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배수 시설
                </label>
                <select
                  value={installationInfo.drainage}
                  onChange={(e) => setInstallationInfo(prev => ({ ...prev, drainage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">상태 선택</option>
                  <option value="available">있음</option>
                  <option value="unavailable">없음</option>
                  <option value="unknown">확인 필요</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">결제 정보</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                결제 방법
              </label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  신용카드
                </Button>
                <Button
                  variant={paymentMethod === 'transfer' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('transfer')}
                  className="flex items-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  계좌이체
                </Button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카드번호 *
                  </label>
                  <Input
                    value={cardInfo.number}
                    onChange={(e) => setCardInfo(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="1234-5678-9012-3456"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      유효기간 *
                    </label>
                    <Input
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo(prev => ({ ...prev, expiry: e.target.value }))}
                      placeholder="MM/YY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC *
                    </label>
                    <Input
                      value={cardInfo.cvc}
                      onChange={(e) => setCardInfo(prev => ({ ...prev, cvc: e.target.value }))}
                      placeholder="123"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카드 소유자명 *
                  </label>
                  <Input
                    value={cardInfo.holder}
                    onChange={(e) => setCardInfo(prev => ({ ...prev, holder: e.target.value }))}
                    placeholder="홍길동"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    할부 개월
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="0">일시불</option>
                    <option value="2">2개월</option>
                    <option value="3">3개월</option>
                    <option value="6">6개월</option>
                    <option value="12">12개월</option>
                    <option value="24">24개월</option>
                  </select>
                </div>
              </div>
            )}

            {paymentMethod === 'transfer' && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">계좌이체 안내</h3>
                <p className="text-blue-800 text-sm">
                  주문 완료 후 안내받은 계좌로 입금해주세요.<br/>
                  입금 확인 후 배송이 시작됩니다.
                </p>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">주문이 완료되었습니다!</h2>
              <p className="text-gray-600">주문 번호: ORD-2024-001234</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">주문 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>주문 금액:</span>
                  <span className="font-semibold">{formatPrice(totalAmount)}원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송 예정일:</span>
                  <span>내일 (2024.01.15)</span>
                </div>
                <div className="flex justify-between">
                  <span>설치 예정일:</span>
                  <span>2024.01.16 오후</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Link href="/account">
                <Button variant="outline">주문 내역 보기</Button>
              </Link>
              <Link href="/">
                <Button>홈으로 가기</Button>
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            장바구니로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">주문/결제</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 주문 단계 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        currentStep >= step.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      <span className={`ml-2 text-sm ${
                        currentStep >= step.id ? 'text-primary font-semibold' : 'text-gray-600'
                      }`}>
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-0.5 mx-4 ${
                          currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {renderStepContent()}
                
                {currentStep < 4 && (
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                      disabled={currentStep === 1}
                    >
                      이전
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                    >
                      {currentStep === 3 ? '주문 완료' : '다음'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 주문 상품 */}
                <div className="space-y-3">
                  {mockCheckoutItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.name}</h4>
                        <p className="text-xs text-gray-600">{item.brand} {item.model}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.color}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.capacity}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {formatPrice(item.price * item.quantity)}원
                        </div>
                        <div className="text-xs text-gray-600">
                          수량: {item.quantity}개
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 가격 정보 */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{formatPrice(subtotal)}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>무료</span>
                  </div>
                  <div className="flex justify-between">
                    <span>설치비</span>
                    <span>무료</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>총 결제 금액</span>
                    <span className="text-primary">{formatPrice(totalAmount)}원</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
