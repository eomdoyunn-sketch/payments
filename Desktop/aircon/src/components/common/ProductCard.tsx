'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star, Truck, Wrench, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ENERGY_GRADES } from '@/lib/constants'

interface Product {
  readonly id: string
  readonly name: string
  readonly brand: string
  readonly model: string
  readonly capacity: string
  readonly type: string
  readonly price: number
  readonly originalPrice?: number
  readonly discountRate?: number
  readonly rating: number
  readonly reviewCount: number
  readonly image: string
  readonly features: readonly string[]
  readonly energyGrade: string
  readonly stock: 'in-stock' | 'low-stock' | 'out-of-stock'
  readonly delivery: string
  readonly installation: string
  readonly color?: string
  readonly description?: string
}

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'detailed'
  showActions?: boolean
  onAddToCart?: (productId: string) => void
  onAddToWishlist?: (productId: string) => void
  onCompare?: (productId: string) => void
  className?: string
}

export function ProductCard({
  product,
  variant = 'default',
  showActions = true,
  onAddToCart,
  onAddToWishlist,
  onCompare,
  className = '',
}: ProductCardProps) {
  const {
    id,
    name,
    brand,
    model,
    capacity,
    type,
    price,
    originalPrice,
    discountRate,
    rating,
    reviewCount,
    image,
    features,
    energyGrade,
    stock,
    delivery,
    installation,
  } = product

  const energyGradeInfo = ENERGY_GRADES.find(grade => grade.id === energyGrade)
  const stockStatus = {
    'in-stock': { text: '재고 있음', color: 'text-green-600', bgColor: 'bg-green-100' },
    'low-stock': { text: '품절임박', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    'out-of-stock': { text: '품절', color: 'text-red-600', bgColor: 'bg-red-100' },
  }[stock]

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

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 flex flex-col h-full ${className}`}>
      <div className="relative flex flex-col h-full">
        {/* 상품 이미지 */}
        <Link href={`/products/${id}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-xl">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            

            {/* 재고 상태 */}
            <Badge 
              variant={stock === 'in-stock' ? 'default' : 'destructive'}
              className={`absolute top-2 right-2 ${stockStatus.bgColor} ${stockStatus.color}`}
            >
              {stockStatus.text}
            </Badge>

            {/* 관심상품 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
              onClick={(e) => {
                e.preventDefault()
                onAddToWishlist?.(id)
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </Link>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            {/* 브랜드 */}
            <div className="text-sm text-gray-500 mb-1">{brand}</div>
            
            {/* 상품명과 할인 정보 */}
            <div className="mb-2">
              <Link href={`/products/${id}`}>
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {name}
                </h3>
              </Link>
              {/* 할인 정보를 상품명 아래로 이동 */}
              {discountRate && discountRate > 0 && (
                <div className="mt-1">
                  <Badge variant="destructive" className="text-xs">
                    {discountRate}% 할인
                  </Badge>
                </div>
              )}
            </div>

            {/* 모델명 및 용량 */}
            <div className="text-sm text-gray-600 mb-2">
              {model} • {capacity}kW • {type}
            </div>

            {/* 주요 기능 */}
            {features.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{features.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* 에너지등급 */}
            {energyGradeInfo && (
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">에너지 {energyGradeInfo.name}</span>
              </div>
            )}

            {/* 평점 */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {renderStars(rating)}
              </div>
              <span className="text-sm text-gray-600">
                {rating.toFixed(1)} ({reviewCount.toLocaleString()})
              </span>
            </div>

            {/* 가격 정보 */}
            <div className="mb-3">
              {originalPrice && originalPrice > price && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(originalPrice)}원
                </div>
              )}
              <div className="text-2xl font-bold text-primary">
                {formatPrice(price)}원
              </div>
            </div>

            {/* 배송 및 설치 정보 */}
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                <span>{delivery}</span>
              </div>
              <div className="flex items-center gap-1">
                <Wrench className="w-4 h-4" />
                <span>{installation}</span>
              </div>
            </div>
          </div>
        </CardContent>

        {/* 액션 버튼 */}
        {showActions && (
          <CardFooter className="p-4 pt-0 mt-auto">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onCompare?.(id)}
              >
                비교
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={() => onAddToCart?.(id)}
                disabled={stock === 'out-of-stock'}
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                장바구니
              </Button>
            </div>
          </CardFooter>
        )}
      </div>
    </Card>
  )
}
