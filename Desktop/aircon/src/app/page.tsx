'use client'

import React, { useState } from 'react'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { ProductCard } from '@/components/common/ProductCard'
import { SearchBar } from '@/components/common/SearchBar'
import { HeroCarousel } from '@/components/common/HeroCarousel'
import { FilterModal } from '@/components/common/FilterModal'
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
import { PRODUCT_TYPES, CAPACITIES, ENERGY_GRADES, SAMPLE_PRODUCTS } from '@/lib/constants'

// 임시 상품 데이터
const mockProducts = SAMPLE_PRODUCTS

const bannerData = [
  {
    id: '1',
    title: '여름 특가! 최대 30% 할인',
    subtitle: '인기 에어컨 모델 특가 판매',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    buttonText: '특가 상품 보기',
    buttonLink: '/products?filter=discount',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: '2',
    title: '무료 설치 서비스',
    subtitle: '전문 설치팀이 안전하게 설치해드립니다',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    buttonText: '설치 문의하기',
    buttonLink: '/installation',
    backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: '3',
    title: '신제품 출시',
    subtitle: '최신 기술이 적용된 스마트 에어컨',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    buttonText: '신제품 보기',
    buttonLink: '/products?filter=new',
    backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    id: '4',
    title: '에너지 효율 1등급',
    subtitle: '친환경 에어컨으로 전기요금 절약하세요',
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    buttonText: '효율 상품 보기',
    buttonLink: '/products?filter=energy',
    backgroundColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: '5',
    title: '브랜드별 특가',
    subtitle: '삼성, LG, 캐리어 등 주요 브랜드 할인',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    buttonText: '브랜드별 보기',
    buttonLink: '/products?filter=brand',
    backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  }
]


export default function HomePage() {
  // 오늘의 특가 필터 상태
  const [specialOfferBrands, setSpecialOfferBrands] = useState<string[]>([])
  const [specialOfferCapacities, setSpecialOfferCapacities] = useState<string[]>([])
  const [specialOfferEnergyGrades, setSpecialOfferEnergyGrades] = useState<string[]>([])
  const [specialOfferFeatures, setSpecialOfferFeatures] = useState<string[]>([])
  const [specialOfferPriceRange, setSpecialOfferPriceRange] = useState<[number, number]>([0, 5000000])

  // 인기 상품 필터 상태
  const [popularBrands, setPopularBrands] = useState<string[]>([])
  const [popularCapacities, setPopularCapacities] = useState<string[]>([])
  const [popularEnergyGrades, setPopularEnergyGrades] = useState<string[]>([])
  const [popularFeatures, setPopularFeatures] = useState<string[]>([])
  const [popularPriceRange, setPopularPriceRange] = useState<[number, number]>([0, 5000000])

  // 오늘의 특가 필터링된 상품들
  const filteredSpecialOfferProducts = mockProducts.filter(product => {
    const matchesBrand = specialOfferBrands.length === 0 || specialOfferBrands.includes(product.brand)
    const matchesCapacity = specialOfferCapacities.length === 0 || specialOfferCapacities.includes(product.capacity)
    const matchesEnergyGrade = specialOfferEnergyGrades.length === 0 || specialOfferEnergyGrades.includes(product.energyGrade)
    const matchesPrice = product.price >= specialOfferPriceRange[0] && product.price <= specialOfferPriceRange[1]
    const matchesFeatures = specialOfferFeatures.length === 0 || 
      specialOfferFeatures.every(feature => product.features.some(f => f === feature))

    return matchesBrand && matchesCapacity && matchesEnergyGrade && matchesPrice && matchesFeatures
  })

  // 인기 상품 필터링된 상품들
  const filteredPopularProducts = mockProducts.filter(product => {
    const matchesBrand = popularBrands.length === 0 || popularBrands.includes(product.brand)
    const matchesCapacity = popularCapacities.length === 0 || popularCapacities.includes(product.capacity)
    const matchesEnergyGrade = popularEnergyGrades.length === 0 || popularEnergyGrades.includes(product.energyGrade)
    const matchesPrice = product.price >= popularPriceRange[0] && product.price <= popularPriceRange[1]
    const matchesFeatures = popularFeatures.length === 0 || 
      popularFeatures.every(feature => product.features.some(f => f === feature))

    return matchesBrand && matchesCapacity && matchesEnergyGrade && matchesPrice && matchesFeatures
  })

  // 오늘의 특가 필터 초기화
  const clearSpecialOfferFilters = () => {
    setSpecialOfferBrands([])
    setSpecialOfferCapacities([])
    setSpecialOfferEnergyGrades([])
    setSpecialOfferFeatures([])
    setSpecialOfferPriceRange([0, 5000000])
  }

  // 인기 상품 필터 초기화
  const clearPopularFilters = () => {
    setPopularBrands([])
    setPopularCapacities([])
    setPopularEnergyGrades([])
    setPopularFeatures([])
    setPopularPriceRange([0, 5000000])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* 메인 히어로 캐러셀 */}
        <section className="relative">
          <HeroCarousel 
            items={bannerData}
            autoPlay={true}
            autoPlayInterval={5000}
            showDots={true}
            showArrows={true}
          />
        </section>


        {/* 오늘의 특가 */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">오늘의 특가</h2>
              <div className="flex items-center gap-4">
                <FilterModal
                  selectedBrands={specialOfferBrands}
                  selectedCapacities={specialOfferCapacities}
                  selectedEnergyGrades={specialOfferEnergyGrades}
                  selectedFeatures={specialOfferFeatures}
                  priceRange={specialOfferPriceRange}
                  onBrandsChange={setSpecialOfferBrands}
                  onCapacitiesChange={setSpecialOfferCapacities}
                  onEnergyGradesChange={setSpecialOfferEnergyGrades}
                  onFeaturesChange={setSpecialOfferFeatures}
                  onPriceRangeChange={setSpecialOfferPriceRange}
                  onApplyFilters={() => {}}
                  onClearFilters={clearSpecialOfferFilters}
                />
                <Button variant="outline">더 보기</Button>
              </div>
            </div>
            
            {/* 필터 결과 카운트 */}
            {(specialOfferBrands.length > 0 || specialOfferCapacities.length > 0 || specialOfferEnergyGrades.length > 0 || specialOfferFeatures.length > 0 || specialOfferPriceRange[0] > 0 || specialOfferPriceRange[1] < 5000000) && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <p className="text-blue-800">
                    필터 적용 결과: <span className="font-semibold">{filteredSpecialOfferProducts.length}</span>개의 특가 상품
                  </p>
                  <Button variant="ghost" size="sm" onClick={clearSpecialOfferFilters} className="text-blue-600 hover:text-blue-800">
                    필터 초기화
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSpecialOfferProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* 필터 적용 시 결과가 없는 경우 */}
            {filteredSpecialOfferProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">선택한 조건에 맞는 특가 상품이 없습니다.</p>
                <Button variant="outline" onClick={clearSpecialOfferFilters} className="mt-4">
                  필터 초기화하고 전체 상품 보기
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* 인기 상품 */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">인기 상품</h2>
              <div className="flex items-center gap-4">
                <FilterModal
                  selectedBrands={popularBrands}
                  selectedCapacities={popularCapacities}
                  selectedEnergyGrades={popularEnergyGrades}
                  selectedFeatures={popularFeatures}
                  priceRange={popularPriceRange}
                  onBrandsChange={setPopularBrands}
                  onCapacitiesChange={setPopularCapacities}
                  onEnergyGradesChange={setPopularEnergyGrades}
                  onFeaturesChange={setPopularFeatures}
                  onPriceRangeChange={setPopularPriceRange}
                  onApplyFilters={() => {}}
                  onClearFilters={clearPopularFilters}
                />
                <Button variant="outline">더 보기</Button>
              </div>
            </div>
            
            {/* 필터 결과 카운트 */}
            {(popularBrands.length > 0 || popularCapacities.length > 0 || popularEnergyGrades.length > 0 || popularFeatures.length > 0 || popularPriceRange[0] > 0 || popularPriceRange[1] < 5000000) && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <p className="text-blue-800">
                    필터 적용 결과: <span className="font-semibold">{filteredPopularProducts.length}</span>개의 인기 상품
                  </p>
                  <Button variant="ghost" size="sm" onClick={clearPopularFilters} className="text-blue-600 hover:text-blue-800">
                    필터 초기화
                  </Button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPopularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {/* 필터 적용 시 결과가 없는 경우 */}
            {filteredPopularProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">선택한 조건에 맞는 인기 상품이 없습니다.</p>
                <Button variant="outline" onClick={clearPopularFilters} className="mt-4">
                  필터 초기화하고 전체 상품 보기
                </Button>
              </div>
            )}
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