'use client'

import React, { useState } from 'react'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { ProductCard } from '@/components/common/ProductCard'
import { SearchBar } from '@/components/common/SearchBar'
import { HeroCarousel } from '@/components/common/HeroCarousel'
import { FilterModal } from '@/components/common/FilterModal'
import { ProductComparison } from '@/components/common/ProductComparison'
import { ImageGallery } from '@/components/common/ImageGallery'
import { InstallCostBlock } from '@/components/common/InstallCostBlock'
import { CategoryQuickAccess } from '@/components/common/CategoryQuickAccess'
import { InstallOptionsSelector } from '@/components/common/InstallOptionsSelector'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
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
  Component,
  Scale
} from 'lucide-react'
import { BRANDS, CAPACITIES, ENERGY_GRADES, FEATURES, SORT_OPTIONS, SAMPLE_PRODUCTS } from '@/lib/constants'

// 캐러셀 데모 데이터
const carouselDemoData = [
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
  }
]

export default function ComponentsDemoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([])
  const [selectedEnergyGrades, setSelectedEnergyGrades] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000])
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedInstallOption, setSelectedInstallOption] = useState<'standard' | 'none' | 'premium'>('standard')
  
  const { toast } = useToast()

  const demoProduct = SAMPLE_PRODUCTS[0]

  const toggleProductComparison = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="common" className="flex items-center gap-2">
              <Component className="w-4 h-4" />
              공통 컴포넌트
            </TabsTrigger>
            <TabsTrigger value="ui" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              UI 컴포넌트
            </TabsTrigger>
            <TabsTrigger value="carousel" className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              캐러셀
            </TabsTrigger>
            <TabsTrigger value="product" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              상품 관련
            </TabsTrigger>
            <TabsTrigger value="interactive" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              인터랙티브
            </TabsTrigger>
            <TabsTrigger value="phase1" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Phase 1 신기능
            </TabsTrigger>
            <TabsTrigger value="new-components" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              신규 컴포넌트
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

          {/* 캐러셀 컴포넌트 데모 */}
          <TabsContent value="carousel" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">캐러셀 컴포넌트</h2>
              
              {/* HeroCarousel 컴포넌트 */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChevronLeft className="w-5 h-5" />
                    HeroCarousel 컴포넌트
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      메인 히어로 섹션에서 사용되는 캐러셀 컴포넌트입니다. 
                      자동 슬라이드, 네비게이션 화살표, 도트 인디케이터를 지원합니다.
                    </p>
                    
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold mb-2">기본 캐러셀</h4>
                      <HeroCarousel 
                        items={carouselDemoData}
                        autoPlay={true}
                        autoPlayInterval={5000}
                        showDots={true}
                        showArrows={true}
                      />
                    </div>

                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold mb-2">자동 슬라이드 비활성화</h4>
                      <HeroCarousel 
                        items={carouselDemoData.slice(0, 3)}
                        autoPlay={false}
                        showDots={true}
                        showArrows={true}
                      />
                    </div>

                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-semibold mb-2">화살표 없음</h4>
                      <HeroCarousel 
                        items={carouselDemoData.slice(0, 2)}
                        autoPlay={true}
                        autoPlayInterval={3000}
                        showDots={true}
                        showArrows={false}
                      />
                    </div>
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

          {/* Phase 1 신기능 데모 */}
          <TabsContent value="phase1" className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Phase 1 신기능</h2>
              <p className="text-gray-600 mb-8">
                Phase 1에서 새로 구현된 고급 기능들을 확인하고 테스트할 수 있습니다.
              </p>
            </div>

            {/* FilterModal 데모 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5" />
                    FilterModal - 고급 필터링
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      복잡한 필터 옵션들을 모달로 분리하여 사용성을 향상시킨 컴포넌트입니다.
                    </p>
                    <FilterModal
                      selectedBrands={selectedBrands}
                      selectedCapacities={selectedCapacities}
                      selectedEnergyGrades={selectedEnergyGrades}
                      selectedFeatures={selectedFeatures}
                      priceRange={priceRange}
                      onBrandsChange={setSelectedBrands}
                      onCapacitiesChange={setSelectedCapacities}
                      onEnergyGradesChange={setSelectedEnergyGrades}
                      onFeaturesChange={setSelectedFeatures}
                      onPriceRangeChange={setPriceRange}
                      onApplyFilters={() => {}}
                      onClearFilters={() => {
                        setSelectedBrands([])
                        setSelectedCapacities([])
                        setSelectedEnergyGrades([])
                        setSelectedFeatures([])
                        setPriceRange([0, 5000000])
                      }}
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>기능:</strong> 브랜드, 용량, 에너지등급, 기능별 필터링, 가격 범위</p>
                      <p><strong>사용 위치:</strong> 상품 목록 페이지</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ProductComparison 데모 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    ProductComparison - 상품 비교
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      최대 4개 상품까지 비교할 수 있는 기능입니다. 하단에 고정 표시되며 비교 페이지로 이동할 수 있습니다.
                    </p>
                    <div className="space-y-4">
                      <div className="flex gap-2 flex-wrap">
                        {SAMPLE_PRODUCTS.slice(0, 4).map((product) => (
                          <Button
                            key={product.id}
                            variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleProductComparison(product.id)}
                          >
                            {product.name}
                          </Button>
                        ))}
                      </div>
                      <ProductComparison
                        selectedProducts={selectedProducts}
                        onToggleProduct={toggleProductComparison}
                        onClearComparison={() => setSelectedProducts([])}
                      />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>기능:</strong> 상품 선택, 비교 테이블, 비교 페이지 이동</p>
                      <p><strong>사용 위치:</strong> 상품 목록, 상품 상세 페이지</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ImageGallery 데모 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    ImageGallery - 이미지 갤러리
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      줌 기능과 썸네일 네비게이션이 포함된 고급 이미지 갤러리입니다.
                    </p>
                    <div className="max-w-md">
                      <ImageGallery
                        images={[
                          '/api/placeholder/400/400',
                          '/api/placeholder/400/400',
                          '/api/placeholder/400/400',
                          '/api/placeholder/400/400'
                        ]}
                        productName="데모 상품"
                      />
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>기능:</strong> 이미지 줌, 썸네일 네비게이션, 터치 지원</p>
                      <p><strong>사용 위치:</strong> 상품 상세 페이지</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spinner 데모 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Spinner - 로딩 스피너
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      다양한 크기의 로딩 스피너 컴포넌트입니다.
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <Spinner size="sm" />
                        <p className="text-xs text-gray-500 mt-2">Small</p>
                      </div>
                      <div className="text-center">
                        <Spinner size="md" />
                        <p className="text-xs text-gray-500 mt-2">Medium</p>
                      </div>
                      <div className="text-center">
                        <Spinner size="lg" />
                        <p className="text-xs text-gray-500 mt-2">Large</p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>기능:</strong> 다양한 크기, 커스텀 색상</p>
                      <p><strong>사용 위치:</strong> 로딩 상태 표시</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Toast 데모 */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Toast - 알림 시스템
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      사용자 액션에 대한 즉각적인 피드백을 제공하는 알림 시스템입니다.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button onClick={() => {
                        toast({
                          title: "성공!",
                          description: "작업이 성공적으로 완료되었습니다."
                        })
                      }}>
                        성공 토스트
                      </Button>
                      <Button variant="outline" onClick={() => {
                        toast({
                          title: "에러 발생",
                          description: "문제가 발생했습니다. 다시 시도해주세요.",
                          variant: "destructive"
                        })
                      }}>
                        에러 토스트
                      </Button>
                      <Button variant="secondary" onClick={() => {
                        toast({
                          title: "정보",
                          description: "새로운 기능이 추가되었습니다.",
                        })
                      }}>
                        기본 토스트
                      </Button>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>기능:</strong> 성공, 에러, 정보 타입별 스타일링</p>
                      <p><strong>사용 위치:</strong> 전역 알림 시스템</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 새로운 컴포넌트들 */}
          <TabsContent value="new-components" className="mt-6">
            <div className="space-y-8">
              {/* 설치비/추가비 고지 블록 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    InstallCostBlock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <InstallCostBlock />
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>기능:</strong> 설치비/추가비용 법적 고지사항 표시</p>
                      <p><strong>사용 위치:</strong> 상품 상세 페이지, 장바구니</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 카테고리 바로가기 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="w-5 h-5 text-blue-600" />
                    CategoryQuickAccess
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <CategoryQuickAccess showDescription={true} />
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>기능:</strong> 주요 에어컨 카테고리로 빠른 이동</p>
                      <p><strong>사용 위치:</strong> 홈페이지</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 설치 옵션 선택기 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-green-600" />
                    InstallOptionsSelector
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <InstallOptionsSelector
                      selectedOption={selectedInstallOption}
                      onOptionChange={setSelectedInstallOption}
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <p><strong>기능:</strong> 표준설치/설치없음/프리미엄 설치 옵션 선택</p>
                      <p><strong>사용 위치:</strong> 상품 상세 페이지, 장바구니</p>
                    </div>
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