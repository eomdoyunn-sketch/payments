'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Wrench, 
  X, 
  Star, 
  Ruler, 
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface InstallOptionsSelectorProps {
  selectedOption: 'standard' | 'none' | 'premium'
  onOptionChange: (option: 'standard' | 'none' | 'premium') => void
  className?: string
}

const installOptions = [
  {
    id: 'standard' as const,
    name: '표준설치',
    description: '기본 설치 서비스 (무료)',
    price: 0,
    originalPrice: 120000,
    discount: 120000,
    icon: Wrench,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    features: [
      '기본 배관 5m 포함',
      '벽면 타공 1회',
      '전원 연결',
      '배수 연결',
      '설치 및 테스트'
    ],
    recommended: true
  },
  {
    id: 'none' as const,
    name: '설치없음',
    description: '직접 설치 (할인 적용)',
    price: -120000,
    originalPrice: 0,
    discount: 120000,
    icon: X,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      '상품만 배송',
      '설치비 할인',
      '직접 설치 필요',
      'A/S는 별도 문의'
    ],
    warning: '설치 경험이 필요합니다'
  },
  {
    id: 'premium' as const,
    name: '프리미엄 설치',
    description: '전문 설치 서비스',
    price: 50000,
    originalPrice: 50000,
    discount: 0,
    icon: Star,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      '전문 설치팀',
      '추가 배관 10m',
      '고급 타공',
      '전문 테스트',
      '1년 설치 보증'
    ]
  }
]

export function InstallOptionsSelector({ 
  selectedOption, 
  onOptionChange, 
  className 
}: InstallOptionsSelectorProps) {
  const [additionalPiping, setAdditionalPiping] = useState(0)

  const formatPrice = (price: number) => {
    if (price === 0) return '무료'
    if (price < 0) return `${price.toLocaleString()}원 할인`
    return `${price.toLocaleString()}원`
  }

  const getTotalPrice = () => {
    const selectedOptionData = installOptions.find(option => option.id === selectedOption)
    if (!selectedOptionData) return 0
    
    let total = selectedOptionData.price
    if (selectedOption === 'standard' && additionalPiping > 0) {
      total += additionalPiping * 15000 // 1m당 15,000원
    }
    
    return total
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">설치 옵션 선택</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {installOptions.map((option) => {
            const IconComponent = option.icon
            const isSelected = selectedOption === option.id
            const isRecommended = option.recommended
            
            return (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? `border-2 ${option.borderColor} ${option.bgColor}` 
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onOptionChange(option.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className={`w-5 h-5 ${option.color}`} />
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                    </div>
                    {isRecommended && (
                      <Badge variant="default" className="bg-green-600">
                        추천
                      </Badge>
                    )}
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* 가격 정보 */}
                  <div className="text-center">
                    {option.originalPrice > 0 && option.discount > 0 && (
                      <div className="text-sm text-gray-500 line-through mb-1">
                        {option.originalPrice.toLocaleString()}원
                      </div>
                    )}
                    <div className={`text-xl font-bold ${option.color}`}>
                      {formatPrice(option.price)}
                    </div>
                    {option.discount > 0 && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {option.discount.toLocaleString()}원 할인
                      </Badge>
                    )}
                  </div>

                  {/* 기능 목록 */}
                  <ul className="text-sm text-gray-600 space-y-1">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* 경고 메시지 */}
                  {option.warning && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 rounded text-amber-700 text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {option.warning}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 추가 배관 옵션 (표준설치 선택 시) */}
      {selectedOption === 'standard' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ruler className="w-5 h-5 text-blue-600" />
              추가 배관 옵션
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  추가 배관 길이:
                </label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={additionalPiping}
                  onChange={(e) => setAdditionalPiping(Math.max(0, Number(e.target.value)))}
                  className="w-20"
                />
                <span className="text-sm text-gray-600">m</span>
              </div>
              {additionalPiping > 0 && (
                <div className="text-sm text-gray-600">
                  추가 비용: <span className="font-semibold text-blue-600">
                    {(additionalPiping * 15000).toLocaleString()}원
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * 기본 5m 포함, 추가 1m당 15,000원
            </p>
          </CardContent>
        </Card>
      )}

      {/* 총 설치비 요약 */}
      <Card className="bg-gray-50">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">총 설치비:</span>
            <span className="text-xl font-bold text-primary">
              {getTotalPrice() === 0 ? '무료' : `${getTotalPrice().toLocaleString()}원`}
            </span>
          </div>
          {getTotalPrice() < 0 && (
            <p className="text-sm text-green-600 mt-1">
              설치비 할인이 적용됩니다
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

