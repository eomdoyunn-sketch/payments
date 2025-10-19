'use client'

import React from 'react'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { ProductCard } from '@/components/common/ProductCard'
import { SearchBar } from '@/components/common/SearchBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Star, 
  Truck, 
  Wrench, 
  Zap, 
  Shield, 
  Gift, 
  TrendingUp,
  Smartphone,
  Wind,
  Flame
} from 'lucide-react'
import { BRANDS, PRODUCT_TYPES, CAPACITIES, ENERGY_GRADES, SAMPLE_PRODUCTS } from '@/lib/constants'

// 임시 상품 데이터
const mockProducts = SAMPLE_PRODUCTS

const bannerData = [
  {
    id: '1',
    title: '여름 특가! 최대 30% 할인',
    subtitle: '인기 에어컨 모델 특가 판매',
    image: '/images/banners/summer-sale.jpg',
    buttonText: '특가 상품 보기',
    buttonLink: '/products?filter=discount',
  },
  {
    id: '2',
    title: '무료 설치 서비스',
    subtitle: '전문 설치팀이 안전하게 설치해드립니다',
    image: '/images/banners/free-installation.jpg',
    buttonText: '설치 문의하기',
    buttonLink: '/installation',
  },
  {
    id: '3',
    title: '신제품 출시',
    subtitle: '최신 기술이 적용된 스마트 에어컨',
    image: '/images/banners/new-products.jpg',
    buttonText: '신제품 보기',
    buttonLink: '/products?filter=new',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* 메인 배너 */}
        <section className="relative">
          <div className="h-96 bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">AirZone</h1>
              <p className="text-xl mb-8">최고의 에어컨을 찾아보세요</p>
              <SearchBar className="max-w-md mx-auto" />
            </div>
          </div>
        </section>

        {/* 브랜드 네비게이션 */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">인기 브랜드</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {BRANDS.map((brand) => (
                <Card key={brand.id} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{brand.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-medium">{brand.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 오늘의 특가 */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">오늘의 특가</h2>
              <Button variant="outline">더 보기</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 인기 상품 */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">인기 상품</h2>
              <Button variant="outline">더 보기</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 카테고리별 상품 */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">용량별 추천</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CAPACITIES.map((capacity) => (
                <Card key={capacity.id} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Wind className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{capacity.name}</h3>
                    <p className="text-gray-600 mb-4">{capacity.description}</p>
                    <Button variant="outline" size="sm">상품 보기</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 서비스 특징 */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">AirZone만의 특별한 서비스</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">무료 배송</h3>
                <p className="text-gray-600">전국 무료 배송으로 빠르고 안전하게</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Wrench className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">무료 설치</h3>
                <p className="text-gray-600">전문 설치팀이 안전하게 설치해드립니다</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">A/S 보장</h3>
                <p className="text-gray-600">3년 무상 A/S로 안심하고 사용하세요</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">특별 혜택</h3>
                <p className="text-gray-600">회원만의 특별한 할인과 혜택</p>
              </div>
            </div>
          </div>
        </section>

        {/* 에너지 효율 정보 */}
        <section className="py-12 bg-green-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">친환경 에너지 효율</h2>
              <p className="text-lg text-gray-600">1등급 에너지 효율로 전기요금을 절약하세요</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ENERGY_GRADES.map((grade) => (
                <Card key={grade.id} className="text-center">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${grade.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                      <Zap className={`w-8 h-8 ${grade.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{grade.name}</h3>
                    <p className="text-gray-600">최고의 에너지 효율</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 신제품 섹션 */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">신제품</h2>
              <Button variant="outline">더 보기</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}