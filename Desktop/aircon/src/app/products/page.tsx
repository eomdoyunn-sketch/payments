'use client'

import React, { useState } from 'react'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { ProductCard } from '@/components/common/ProductCard'
import { SearchBar } from '@/components/common/SearchBar'
import { FilterModal } from '@/components/common/FilterModal'
import { ProductComparison } from '@/components/common/ProductComparison'
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
  SlidersHorizontal,
  Scale
} from 'lucide-react'
import { BRANDS, CAPACITIES, ENERGY_GRADES, FEATURES, SORT_OPTIONS, SAMPLE_PRODUCTS } from '@/lib/constants'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([])
  const [selectedEnergyGrades, setSelectedEnergyGrades] = useState<string[]>([])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000])
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesCapacity = selectedCapacities.length === 0 || selectedCapacities.includes(product.capacity)
    const matchesEnergyGrade = selectedEnergyGrades.length === 0 || selectedEnergyGrades.includes(product.energyGrade)
    
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => product.features.some(f => f === feature))

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

  const toggleProductComparison = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const clearComparison = () => {
    setSelectedProducts([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">에어컨 상품</h1>
          <p className="text-gray-600 mt-2">원하는 조건에 맞는 에어컨을 찾아보세요</p>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="상품명, 브랜드 검색"
          />
        </div>

        {/* 필터 및 정렬 바 */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex gap-2 flex-wrap">
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
              onClearFilters={clearFilters}
            />
            
            <ProductComparison
              selectedProducts={selectedProducts}
              onToggleProduct={toggleProductComparison}
              onClearComparison={clearComparison}
            />

            {/* 정렬 옵션 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">정렬:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 뷰 모드 */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 결과 카운트 */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold">{sortedProducts.length}</span>개의 상품이 있습니다.
          </p>
        </div>

        {/* 상품 목록 */}
        <div className="mb-8">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <div className="absolute top-2 left-2">
                    <Button
                      variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleProductComparison(product.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Scale className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <div className="absolute top-2 left-2">
                    <Button
                      variant={selectedProducts.includes(product.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleProductComparison(product.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Scale className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 결과 없음 */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                검색 조건에 맞는 상품이 없습니다.
              </div>
              <Button onClick={clearFilters} variant="outline">
                필터 초기화
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}