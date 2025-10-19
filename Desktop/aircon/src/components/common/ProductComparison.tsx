'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Scale, X, Star, Truck, Wrench, Zap } from 'lucide-react'
import { SAMPLE_PRODUCTS } from '@/lib/constants'

interface ProductComparisonProps {
  selectedProducts: string[]
  onToggleProduct: (productId: string) => void
  onClearComparison: () => void
}

interface Product {
  id: string
  name: string
  brand: string
  model: string
  capacity: string
  type: string
  price: number
  originalPrice?: number
  discountRate?: number
  rating: number
  reviewCount: number
  image: string
  features: readonly string[]
  energyGrade: string
  stock: 'in-stock' | 'low-stock' | 'out-of-stock'
  delivery: string
  installation: string
}

export function ProductComparison({
  selectedProducts,
  onToggleProduct,
  onClearComparison
}: ProductComparisonProps) {
  const [open, setOpen] = React.useState(false)

  const comparisonProducts = SAMPLE_PRODUCTS.filter(product => 
    selectedProducts.includes(product.id)
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getStockStatus = (stock: string) => {
    switch (stock) {
      case 'in-stock':
        return { text: '재고 있음', color: 'text-green-600', bgColor: 'bg-green-100' }
      case 'low-stock':
        return { text: '품절임박', color: 'text-orange-600', bgColor: 'bg-orange-100' }
      case 'out-of-stock':
        return { text: '품절', color: 'text-red-600', bgColor: 'bg-red-100' }
      default:
        return { text: '재고 있음', color: 'text-green-600', bgColor: 'bg-green-100' }
    }
  }

  if (comparisonProducts.length === 0) {
    return (
      <Button variant="outline" disabled>
        <Scale className="w-4 h-4 mr-2" />
        상품 비교 (0)
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Scale className="w-4 h-4 mr-2" />
          상품 비교 ({comparisonProducts.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>상품 비교</span>
            <Button variant="ghost" size="sm" onClick={onClearComparison}>
              <X className="w-4 h-4 mr-1" />
              모두 제거
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* 상품 이미지 및 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">상품 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${comparisonProducts.length === 2 ? 'grid-cols-2' : comparisonProducts.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="text-center space-y-3">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => onToggleProduct(product.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                      <div className="text-sm text-gray-600">{product.brand} {product.model}</div>
                      <div className="text-sm text-gray-600">{product.capacity} • {product.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 가격 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">가격 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${comparisonProducts.length === 2 ? 'grid-cols-2' : comparisonProducts.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="text-center space-y-2">
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}원
                      </div>
                    )}
                    <div className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}원
                    </div>
                    {product.discountRate && (
                      <Badge variant="destructive">
                        {product.discountRate}% 할인
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 평점 및 리뷰 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">평점 및 리뷰</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${comparisonProducts.length === 2 ? 'grid-cols-2' : comparisonProducts.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="text-center space-y-2">
                    <div className="flex justify-center">
                      {renderStars(product.rating)}
                    </div>
                    <div className="text-lg font-bold">{product.rating}</div>
                    <div className="text-sm text-gray-600">
                      ({product.reviewCount.toLocaleString()}개 리뷰)
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 주요 기능 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">주요 기능</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${comparisonProducts.length === 2 ? 'grid-cols-2' : comparisonProducts.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 배송 및 설치 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">배송 및 설치</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${comparisonProducts.length === 2 ? 'grid-cols-2' : comparisonProducts.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {comparisonProducts.map((product) => (
                  <div key={product.id} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>{product.delivery}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="w-4 h-4 text-blue-600" />
                      <span>{product.installation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span>에너지 {product.energyGrade}등급</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
