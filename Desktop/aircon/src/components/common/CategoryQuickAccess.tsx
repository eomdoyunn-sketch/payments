'use client'

import React from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Monitor, 
  Square, 
  Layers, 
  Move, 
  Building, 
  Home,
  ArrowRight
} from 'lucide-react'

interface CategoryQuickAccessProps {
  className?: string
  showDescription?: boolean
}

const categories = [
  {
    id: 'stand',
    name: '스탠드형',
    description: '이동이 자유로운 스탠드형',
    icon: Monitor,
    href: '/products?type=stand',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hoverColor: 'hover:bg-blue-100'
  },
  {
    id: 'wall-mounted',
    name: '벽걸이형',
    description: '공간 효율적인 벽걸이형',
    icon: Square,
    href: '/products?type=wall-mounted',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    hoverColor: 'hover:bg-green-100'
  },
  {
    id: 'system',
    name: '시스템형',
    description: '다중 실내기 연결',
    icon: Layers,
    href: '/products?type=system',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    hoverColor: 'hover:bg-purple-100'
  },
  {
    id: 'portable',
    name: '이동식',
    description: '간편한 이동식',
    icon: Move,
    href: '/products?type=portable',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100'
  },
  {
    id: 'office',
    name: '사무실용',
    description: '사무실 환경 최적화',
    icon: Building,
    href: '/products?type=office',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    hoverColor: 'hover:bg-indigo-100'
  },
  {
    id: 'home',
    name: '가정용',
    description: '가정 환경 맞춤형',
    icon: Home,
    href: '/products?type=home',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    hoverColor: 'hover:bg-pink-100'
  }
]

export function CategoryQuickAccess({ 
  className, 
  showDescription = true 
}: CategoryQuickAccessProps) {
  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">카테고리별 에어컨</h2>
          <p className="text-lg text-gray-600">용도에 맞는 에어컨을 찾아보세요</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link key={category.id} href={category.href}>
                <Card className={`text-center hover:shadow-lg transition-all duration-200 cursor-pointer group ${category.hoverColor}`}>
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${category.bgColor} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className={`w-8 h-8 ${category.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
                    {showDescription && (
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-500 group-hover:text-gray-900 transition-colors duration-200"
                    >
                      보러가기
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
