'use client'

import React, { useState } from 'react'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { ProductCard } from '@/components/common/ProductCard'
import { SearchBar } from '@/components/common/SearchBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  Truck, 
  Wrench, 
  Shield,
  Zap,
  Wind,
  Flame,
  Volume2,
  Smartphone,
  Wifi,
  Sparkles,
  Droplets,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
  Grid,
  List,
  ChevronDown,
  X,
  SlidersHorizontal,
  Eye,
  Code,
  Palette,
  Layout,
  Component
} from 'lucide-react'
import { BRANDS, CAPACITIES, ENERGY_GRADES, FEATURES, SORT_OPTIONS, SAMPLE_PRODUCTS } from '@/lib/constants'

export default function ComponentsDemoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([])
  const [selectedEnergyGrades, setSelectedEnergyGrades] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const demoProduct = SAMPLE_PRODUCTS[0]

  const toggleFilter = (type: string, value: string) => {
    switch (type) {
      case 'brand':
        setSelectedBrands(prev => 
          prev.includes(value) 
            ? prev.filter(b => b !== value)
            : [...prev, value]
        )
        break
      case 'capacity':
        setSelectedCapacities(prev => 
          prev.includes(value) 
            ? prev.filter(c => c !== value)
            : [...prev, value]
        )
        break
      case 'energyGrade':
        setSelectedEnergyGrades(prev => 
          prev.includes(value) 
            ? prev.filter(e => e !== value)
            : [...prev, value]
        )
        break
      case 'feature':
        setSelectedFeatures(prev => 
          prev.includes(value) 
            ? prev.filter(f => f !== value)
            : [...prev, value]
        )
        break
    }
  }

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCapacities([])
    setSelectedEnergyGrades([])
    setSelectedFeatures([])
    setPriceRange([0, 5000000])
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AirZone 컴포넌트 데모</h1>
          <p className="text-gray-600 text-lg">
            AirZone에서 사용되는 모든 컴포넌트들을 확인하고 테스트할 수 있습니다.
          </p>
        </div>

        <Tabs defaultValue="common" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="common" className="flex items-center gap-2">
              <Component className="w-4 h-4" />
              공통 컴포넌트
            </TabsTrigger>
            <TabsTrigger value="ui" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              UI 컴포넌트
            </TabsTrigger>
            <TabsTrigger value="product" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              상품 관련
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              인터랙티브
            </TabsTrigger>
          </TabsList>

          {/* 공통 컴포넌트 데모 */}
          <TabsContent value="common" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">공통 컴포넌트</h2>
              
              {/* Header 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    Header 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <Header />
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>기능:</strong> 로고, 검색바, 사용자 메뉴, 장바구니</p>
                    <p><strong>사용 위치:</strong> 모든 페이지 상단</p>
                  </div>
                </CardContent>
              </Card>

              {/* Footer 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    Footer 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <Footer />
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>기능:</strong> 회사 정보, 링크, 소셜 미디어</p>
                    <p><strong>사용 위치:</strong> 모든 페이지 하단</p>
                  </div>
                </CardContent>
              </Card>

              {/* SearchBar 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5" />
                    SearchBar 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="에어컨 모델명, 브랜드 검색"
                    />
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>기능:</strong> 실시간 검색, 자동완성, 검색 히스토리</p>
                    <p><strong>사용 위치:</strong> Header, 상품 목록 페이지</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* UI 컴포넌트 데모 */}
          <TabsContent value="ui" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">UI 컴포넌트</h2>
              
              {/* Button 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Button 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <Button>기본 버튼</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon"><Heart className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Variants:</strong> default, secondary, outline, ghost, destructive</p>
                    <p><strong>Sizes:</strong> sm, default, lg, icon</p>
                  </div>
                </CardContent>
              </Card>

              {/* Badge 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Badge 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex flex-wrap gap-4">
                      <Badge>기본</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Variants:</strong> default, secondary, outline, destructive</p>
                    <p><strong>사용:</strong> 할인율, 재고 상태, 기능 표시</p>
                  </div>
                </CardContent>
              </Card>

              {/* Card 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Card 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>기본 카드</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>카드 내용입니다.</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>상품 카드</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <h3 className="font-semibold">상품명</h3>
                            <p className="text-sm text-gray-600">상품 설명</p>
                            <div className="flex justify-between">
                              <span className="font-bold">100,000원</span>
                              <Badge>할인</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>구성:</strong> Card, CardHeader, CardTitle, CardContent</p>
                    <p><strong>사용:</strong> 상품 카드, 정보 표시, 레이아웃</p>
                  </div>
                </CardContent>
              </Card>

              {/* Input 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Input 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">기본 입력</label>
                        <Input placeholder="텍스트를 입력하세요" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">검색 입력</label>
                        <Input placeholder="검색어를 입력하세요" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>사용:</strong> 검색, 폼 입력, 필터링</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Tabs 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <Tabs defaultValue="tab1" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="tab1">탭 1</TabsTrigger>
                        <TabsTrigger value="tab2">탭 2</TabsTrigger>
                        <TabsTrigger value="tab3">탭 3</TabsTrigger>
                      </TabsList>
                      <TabsContent value="tab1" className="mt-4">
                        <p>첫 번째 탭 내용입니다.</p>
                      </TabsContent>
                      <TabsContent value="tab2" className="mt-4">
                        <p>두 번째 탭 내용입니다.</p>
                      </TabsContent>
                      <TabsContent value="tab3" className="mt-4">
                        <p>세 번째 탭 내용입니다.</p>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>구성:</strong> Tabs, TabsList, TabsTrigger, TabsContent</p>
                    <p><strong>사용:</strong> 상품 상세 정보, 필터링, 네비게이션</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 상품 관련 컴포넌트 데모 */}
          <TabsContent value="product" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">상품 관련 컴포넌트</h2>
              
              {/* ProductCard 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    ProductCard 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <ProductCard
                        product={demoProduct}
                        variant="default"
                      />
                      <ProductCard
                        product={demoProduct}
                        variant="detailed"
                      />
                      <ProductCard
                        product={demoProduct}
                        variant="compact"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Variants:</strong> default, detailed, compact</p>
                    <p><strong>기능:</strong> 상품 정보 표시, 가격, 평점, 재고 상태, 관심상품</p>
                    <p><strong>사용 위치:</strong> 홈페이지, 상품 목록, 추천 상품</p>
                  </div>
                </CardContent>
              </Card>

              {/* 상품 필터링 데모 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    상품 필터링 시스템
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* 필터 사이드바 */}
                      <div className="lg:col-span-1">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="font-semibold">필터</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                              >
                                전체 해제
                              </Button>
                            </div>

                            {/* 브랜드 필터 */}
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">브랜드</h4>
                              <div className="space-y-1">
                                {BRANDS.slice(0, 3).map((brand) => (
                                  <label key={brand.id} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedBrands.includes(brand.name)}
                                      onChange={() => toggleFilter('brand', brand.name)}
                                      className="w-4 h-4 text-primary"
                                    />
                                    <span className="ml-2 text-sm">{brand.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* 용량 필터 */}
                            <div className="mb-4">
                              <h4 className="font-medium mb-2">용량</h4>
                              <div className="space-y-1">
                                {CAPACITIES.slice(0, 3).map((capacity) => (
                                  <label key={capacity.id} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedCapacities.includes(capacity.name)}
                                      onChange={() => toggleFilter('capacity', capacity.name)}
                                      className="w-4 h-4 text-primary"
                                    />
                                    <span className="ml-2 text-sm">{capacity.name}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* 상품 목록 */}
                      <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-600">
                            총 {SAMPLE_PRODUCTS.length}개 상품
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <SortAsc className="w-4 h-4" />
                              <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                              >
                                {SORT_OPTIONS.map((option) => (
                                  <option key={option.id} value={option.value}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex items-center gap-1 border border-gray-300 rounded-md">
                              <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                              >
                                <Grid className="w-4 h-4" />
                              </Button>
                              <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                              >
                                <List className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className={`grid gap-4 ${
                          viewMode === 'grid' 
                            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                            : 'grid-cols-1'
                        }`}>
                          {SAMPLE_PRODUCTS.slice(0, 3).map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              variant={viewMode === 'list' ? 'detailed' : 'default'}
                              className={viewMode === 'list' ? 'flex-row' : ''}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>기능:</strong> 브랜드, 용량, 에너지등급, 기능별 필터링</p>
                    <p><strong>정렬:</strong> 인기순, 가격순, 평점순, 신상품순</p>
                    <p><strong>보기 모드:</strong> 그리드, 리스트</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 인터랙티브 컴포넌트 데모 */}
          <TabsContent value="interactive" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">인터랙티브 컴포넌트</h2>
              
              {/* 상품 상세 데모 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    상품 상세 페이지 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* 상품 이미지 */}
                      <div className="space-y-4">
                        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">상품 이미지</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-xs text-gray-500">{i}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 상품 정보 */}
                      <div className="space-y-6">
                        <div>
                          <div className="text-sm text-gray-500 mb-2">{demoProduct.brand}</div>
                          <h1 className="text-2xl font-bold text-gray-900 mb-2">{demoProduct.name}</h1>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(demoProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                {demoProduct.rating} ({demoProduct.reviewCount.toLocaleString()}개 리뷰)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 가격 정보 */}
                        <div className="space-y-2">
                          {demoProduct.originalPrice && (
                            <div className="text-lg text-gray-500 line-through">
                              {demoProduct.originalPrice.toLocaleString()}원
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold text-primary">
                              {demoProduct.price.toLocaleString()}원
                            </div>
                            {demoProduct.discountRate && (
                              <Badge variant="destructive" className="text-lg px-3 py-1">
                                {demoProduct.discountRate}% 할인
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* 옵션 선택 */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">색상</h3>
                            <div className="flex gap-2">
                              {['화이트', '베이지', '실버', '블랙'].map((color) => (
                                <Button
                                  key={color}
                                  variant="outline"
                                  size="sm"
                                >
                                  {color}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 배송/설치 정보 */}
                        <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{demoProduct.delivery}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wrench className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">{demoProduct.installation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">1년 무상 보증</span>
                          </div>
                        </div>

                        {/* 구매 버튼 */}
                        <div className="flex gap-4">
                          <Button variant="outline" size="lg" className="flex-1">
                            <Heart className="w-4 h-4 mr-2" />
                            관심상품
                          </Button>
                          <Button size="lg" className="flex-1">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            장바구니 담기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>기능:</strong> 상품 정보, 가격, 옵션 선택, 구매 버튼</p>
                    <p><strong>사용 위치:</strong> 상품 상세 페이지</p>
                  </div>
                </CardContent>
              </Card>

              {/* 탭 네비게이션 데모 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    탭 네비게이션 데모
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white">
                    <Tabs defaultValue="specs" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="specs">상세 스펙</TabsTrigger>
                        <TabsTrigger value="reviews">리뷰</TabsTrigger>
                        <TabsTrigger value="qna">Q&A</TabsTrigger>
                        <TabsTrigger value="shipping">배송/교환</TabsTrigger>
                      </TabsList>

                      <TabsContent value="specs" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>상세 스펙</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-semibold mb-3">기본 정보</h3>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">브랜드</span>
                                    <span>{demoProduct.brand}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">모델명</span>
                                    <span>{demoProduct.model}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">용량</span>
                                    <span>{demoProduct.capacity}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-3">주요 기능</h3>
                                <div className="flex flex-wrap gap-2">
                                  {demoProduct.features.map((feature, index) => (
                                    <Badge key={index} variant="secondary">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="reviews" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>고객 리뷰</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center py-8">
                              <div className="text-gray-500 mb-4">리뷰가 아직 없습니다</div>
                              <Button variant="outline">첫 리뷰 작성하기</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="qna" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Q&A</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center py-8">
                              <div className="text-gray-500 mb-4">문의가 아직 없습니다</div>
                              <Button variant="outline">문의하기</Button>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="shipping" className="mt-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>배송/교환 안내</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h3 className="font-semibold mb-2">배송 안내</h3>
                              <ul className="text-sm text-gray-600 space-y-1">
                                <li>• 전국 무료 배송 (30만원 이상 구매 시)</li>
                                <li>• 일반 배송: 3-5일 소요</li>
                                <li>• 당일 배송: 추가 비용 1만원</li>
                                <li>• 설치 서비스 포함</li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>기능:</strong> 상세 정보, 리뷰, Q&A, 배송 정보 탭</p>
                    <p><strong>사용 위치:</strong> 상품 상세 페이지</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}