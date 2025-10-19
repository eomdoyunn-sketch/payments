'use client'

import React, { useState } from 'react'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { ProductCard } from '@/components/common/ProductCard'
import { SearchBar } from '@/components/common/SearchBar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Filter, 
  SortAsc, 
  Grid, 
  List, 
  ChevronDown,
  X,
  SlidersHorizontal
} from 'lucide-react'
import { BRANDS, CAPACITIES, ENERGY_GRADES, FEATURES, SORT_OPTIONS, SAMPLE_PRODUCTS } from '@/lib/constants'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([])
  const [selectedEnergyGrades, setSelectedEnergyGrades] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesCapacity = selectedCapacities.length === 0 || selectedCapacities.includes(product.capacity)
    const matchesEnergyGrade = selectedEnergyGrades.length === 0 || selectedEnergyGrades.includes(product.energyGrade)
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => product.features.includes(feature))

    return matchesSearch && matchesBrand && matchesCapacity && 
           matchesEnergyGrade && matchesPrice && matchesFeatures
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price
      case 'price_desc':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id.localeCompare(a.id)
      case 'discount':
        return (b.discountRate || 0) - (a.discountRate || 0)
      default:
        return 0
    }
  })

  const clearFilters = () => {
    setSelectedBrands([])
    setSelectedCapacities([])
    setSelectedEnergyGrades([])
    setSelectedFeatures([])
    setPriceRange([0, 5000000])
    setSearchQuery('')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">에어컨 상품</h1>
          <p className="text-gray-600 mt-2">원하는 조건에 맞는 에어컨을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 필터 사이드바 */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">필터</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    전체 해제
                  </Button>
                </div>

                {/* 검색 */}
                <div className="mb-6">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="상품명, 브랜드 검색"
                  />
                </div>

                {/* 브랜드 필터 */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">브랜드</h3>
                  <div className="space-y-2">
                    {BRANDS.map((brand) => (
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
                <div className="mb-6">
                  <h3 className="font-medium mb-3">용량</h3>
                  <div className="space-y-2">
                    {CAPACITIES.map((capacity) => (
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

                {/* 에너지등급 필터 */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">에너지등급</h3>
                  <div className="space-y-2">
                    {ENERGY_GRADES.map((grade) => (
                      <label key={grade.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedEnergyGrades.includes(grade.name)}
                          onChange={() => toggleFilter('energyGrade', grade.name)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-2 text-sm">{grade.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 기능 필터 */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">주요 기능</h3>
                  <div className="space-y-2">
                    {FEATURES.map((feature) => (
                      <label key={feature.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature.name)}
                          onChange={() => toggleFilter('feature', feature.name)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="ml-2 text-sm">{feature.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 가격 범위 */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">가격 범위</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="최소가"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="text-sm"
                      />
                      <span className="text-sm text-gray-500">~</span>
                      <Input
                        type="number"
                        placeholder="최대가"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 상품 목록 */}
          <div className="lg:col-span-3">
            {/* 상단 컨트롤 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  필터
                </Button>
                
                <div className="text-sm text-gray-600">
                  총 {filteredProducts.length}개 상품
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* 정렬 */}
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

                {/* 보기 모드 */}
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

            {/* 상품 그리드 */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">검색 결과가 없습니다</div>
                <Button variant="outline" onClick={clearFilters}>
                  필터 초기화
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={viewMode === 'list' ? 'detailed' : 'default'}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}