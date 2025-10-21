'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Truck, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { InstallOptionsSelector } from '@/components/common/InstallOptionsSelector'

interface CartItem {
  id: string
  name: string
  brand: string
  model: string
  image: string
  price: number
  originalPrice?: number
  discountRate?: number
  quantity: number
  color: string
  capacity: string
  type: string
  installation: string
  delivery: string
}

const mockCartItems: CartItem[] = [
  {
    id: '1',
    name: '삼성 인버터 벽걸이형 에어컨',
    brand: '삼성',
    model: 'AR12T9170HZ',
    image: '/api/placeholder/150/150',
    price: 850000,
    originalPrice: 1200000,
    discountRate: 29,
    quantity: 1,
    color: '화이트',
    capacity: '3.5kW',
    type: '벽걸이형',
    installation: '무료 설치',
    delivery: '내일 도착'
  },
  {
    id: '2',
    name: 'LG 스마트 인버터 에어컨',
    brand: 'LG',
    model: 'S12MW3',
    image: '/api/placeholder/150/150',
    price: 950000,
    originalPrice: 1300000,
    discountRate: 27,
    quantity: 1,
    color: '베이지',
    capacity: '3.0kW',
    type: '벽걸이형',
    installation: '무료 설치',
    delivery: '내일 도착'
  }
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [points, setPoints] = useState(0)
  const [selectedInstallOption, setSelectedInstallOption] = useState<'standard' | 'none' | 'premium'>('standard')

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 5) return
    
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
    setSelectedItems(selected => selected.filter(itemId => itemId !== id))
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const selectAllItems = () => {
    setSelectedItems(cartItems.map(item => item.id))
  }

  const deselectAllItems = () => {
    setSelectedItems([])
  }

  const selectedItemsData = cartItems.filter(item => selectedItems.includes(item.id))
  
  const subtotal = selectedItemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = selectedItemsData.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + ((item.originalPrice - item.price) * item.quantity)
    }
    return sum
  }, 0)
  
  const shippingFee = subtotal >= 300000 ? 0 : 30000
  const installationFee = 0 // 무료 설치
  const totalAmount = subtotal - discountAmount + shippingFee + installationFee - points

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">장바구니</h1>
          <p className="text-gray-600 mt-2">선택한 상품을 확인하고 주문하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 장바구니 상품 목록 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">장바구니 상품</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllItems}
                    >
                      전체 선택
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={deselectAllItems}
                    >
                      선택 해제
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">장바구니가 비어있습니다</h3>
                    <p className="text-gray-600 mb-4">원하는 상품을 장바구니에 담아보세요</p>
                    <Link href="/products">
                      <Button>상품 둘러보기</Button>
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="w-4 h-4 text-primary"
                      />
                      
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.brand} {item.model}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {item.color}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.capacity}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 5}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="text-right min-w-0">
                        {item.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(item.originalPrice * item.quantity)}원
                          </div>
                        )}
                        <div className="font-semibold text-lg text-primary">
                          {formatPrice(item.price * item.quantity)}원
                        </div>
                        {item.discountRate && (
                          <div className="text-sm text-red-600">
                            {item.discountRate}% 할인
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 설치 옵션 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    설치 옵션
                  </label>
                  <InstallOptionsSelector
                    selectedOption={selectedInstallOption}
                    onOptionChange={setSelectedInstallOption}
                  />
                </div>

                {/* 쿠폰 적용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    쿠폰 코드
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="쿠폰 코드 입력"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      적용
                    </Button>
                  </div>
                </div>

                {/* 적립금 사용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    적립금 사용
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="사용할 적립금"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                    />
                    <Button variant="outline" size="sm">
                      전액 사용
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    보유 적립금: 50,000원
                  </p>
                </div>

                {/* 가격 정보 */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{formatPrice(subtotal)}원</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>할인 금액</span>
                      <span>-{formatPrice(discountAmount)}원</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>
                      {shippingFee === 0 ? '무료' : `${formatPrice(shippingFee)}원`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>설치비</span>
                    <span>무료</span>
                  </div>
                  
                  {points > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>적립금 사용</span>
                      <span>-{formatPrice(points)}원</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>총 결제 금액</span>
                    <span className="text-primary">{formatPrice(totalAmount)}원</span>
                  </div>
                </div>

                {/* 주문 버튼 */}
                <div className="space-y-2 pt-4">
                  <Link href="/checkout" className="block">
                    <Button className="w-full" size="lg" disabled={selectedItems.length === 0}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      주문하기
                    </Button>
                  </Link>
                  
                  <div className="text-center text-sm text-gray-600">
                    <p>• 무료 배송 (30만원 이상 구매 시)</p>
                    <p>• 무료 설치 서비스</p>
                    <p>• 전국 배송 가능</p>
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
