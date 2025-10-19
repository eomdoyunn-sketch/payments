'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, Package, Truck, Wrench, Star, Heart, CreditCard, Settings, LogOut, Bell, Gift, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'

interface Order {
  id: string
  date: string
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
  items: Array<{
    name: string
    image: string
    quantity: number
    price: number
  }>
  total: number
}

interface Review {
  id: string
  productName: string
  productImage: string
  rating: number
  content: string
  date: string
  helpful: number
}

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-10',
    status: 'delivered',
    items: [
      {
        name: '삼성 인버터 벽걸이형 에어컨',
        image: '/api/placeholder/60/60',
        quantity: 1,
        price: 850000
      }
    ],
    total: 850000
  },
  {
    id: 'ORD-002',
    date: '2024-01-08',
    status: 'shipping',
    items: [
      {
        name: 'LG 스마트 인버터 에어컨',
        image: '/api/placeholder/60/60',
        quantity: 1,
        price: 950000
      }
    ],
    total: 950000
  }
]

const mockReviews: Review[] = [
  {
    id: 'REV-001',
    productName: '삼성 인버터 벽걸이형 에어컨',
    productImage: '/api/placeholder/60/60',
    rating: 5,
    content: '설치도 빠르고 성능도 정말 좋습니다. 추천해요!',
    date: '2024-01-12',
    helpful: 12
  }
]

const mockWishlist = [
  {
    id: '1',
    name: '캐리어 인버터 에어컨',
    image: '/api/placeholder/100/100',
    price: 750000,
    originalPrice: 1000000,
    discountRate: 25
  }
]

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders')
  const [userInfo, setUserInfo] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123'
  })

  const tabs = [
    { id: 'orders', label: '주문 내역', icon: Package },
    { id: 'reviews', label: '리뷰 관리', icon: Star },
    { id: 'wishlist', label: '관심 상품', icon: Heart },
    { id: 'coupons', label: '쿠폰/적립금', icon: Gift },
    { id: 'notifications', label: '알림 설정', icon: Bell },
    { id: 'profile', label: '개인정보', icon: User }
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: '결제 대기',
      confirmed: '주문 확인',
      shipping: '배송 중',
      delivered: '배송 완료',
      cancelled: '주문 취소'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipping: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-800'
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">주문 내역</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-md">
                  <option value="all">전체</option>
                  <option value="pending">결제 대기</option>
                  <option value="confirmed">주문 확인</option>
                  <option value="shipping">배송 중</option>
                  <option value="delivered">배송 완료</option>
                </select>
              </div>
            </div>

            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">주문번호: {order.id}</h3>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(item.price)}원</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-lg font-bold">
                      총 주문 금액: {formatPrice(order.total)}원
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        상세 보기
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline" size="sm">
                          리뷰 작성
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case 'reviews':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">리뷰 관리</h2>
            
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={review.productImage}
                        alt={review.productName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{review.productName}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">{review.date}</span>
                      </div>
                      <p className="text-gray-700 mb-2">{review.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>도움됨 {review.helpful}명</span>
                        <Button variant="ghost" size="sm">
                          수정
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )

      case 'wishlist':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">관심 상품</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWishlist.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <h3 className="font-semibold mb-2">{item.name}</h3>
                    <div className="space-y-2">
                      {item.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(item.originalPrice)}원
                        </div>
                      )}
                      <div className="font-bold text-lg text-primary">
                        {formatPrice(item.price)}원
                      </div>
                      {item.discountRate && (
                        <Badge variant="destructive" className="text-xs">
                          {item.discountRate}% 할인
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" className="flex-1">
                        장바구니 담기
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'coupons':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">쿠폰 및 적립금</h2>
            
            {/* 적립금 현황 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  적립금 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">50,000원</div>
                    <div className="text-sm text-gray-600">보유 적립금</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">5,000원</div>
                    <div className="text-sm text-gray-600">사용 가능</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">2,000원</div>
                    <div className="text-sm text-gray-600">적립 예정</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 쿠폰 목록 */}
            <Card>
              <CardHeader>
                <CardTitle>보유 쿠폰</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">신규 회원 할인 쿠폰</h3>
                      <p className="text-sm text-gray-600">10% 할인 (최대 5만원)</p>
                      <p className="text-xs text-gray-500">만료일: 2024-02-28</p>
                    </div>
                    <Button variant="outline" size="sm">
                      사용하기
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">무료 배송 쿠폰</h3>
                      <p className="text-sm text-gray-600">배송비 무료</p>
                      <p className="text-xs text-gray-500">만료일: 2024-03-15</p>
                    </div>
                    <Button variant="outline" size="sm">
                      사용하기
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">알림 설정</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  알림 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">주문 알림</h3>
                    <p className="text-sm text-gray-600">주문 상태 변경 시 알림</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">배송 알림</h3>
                    <p className="text-sm text-gray-600">배송 진행 상황 알림</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">할인 알림</h3>
                    <p className="text-sm text-gray-600">관심 상품 할인 알림</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">이벤트 알림</h3>
                    <p className="text-sm text-gray-600">특별 이벤트 알림</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">개인정보 관리</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <Input
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이메일
                    </label>
                    <Input
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      휴대폰 번호
                    </label>
                    <Input
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      주소
                    </label>
                    <Input
                      value={userInfo.address}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button>정보 수정</Button>
                  <Button variant="outline">비밀번호 변경</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  보안 설정
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">2단계 인증</h3>
                    <p className="text-sm text-gray-600">계정 보안을 위한 추가 인증</p>
                  </div>
                  <Button variant="outline" size="sm">
                    설정
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">로그인 알림</h3>
                    <p className="text-sm text-gray-600">새로운 기기 로그인 시 알림</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
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
          <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
          <p className="text-gray-600 mt-2">주문 내역, 리뷰, 관심 상품 등을 관리하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {userInfo.name}님
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                        activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
                
                <div className="p-4 border-t">
                  <Button variant="outline" className="w-full" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    로그아웃
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
