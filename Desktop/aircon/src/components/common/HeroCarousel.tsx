'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselItem {
  id: string
  title: string
  subtitle: string
  image: string
  buttonText: string
  buttonLink: string
  backgroundColor?: string
}

interface HeroCarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
}

export function HeroCarousel({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true 
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // 자동 슬라이드
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      )
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, items.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1)
  }

  if (items.length === 0) return null

  const currentItem = items[currentIndex]

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* 메인 슬라이드 */}
      <div 
        className="relative w-full h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`
        }}
      >
        <div className="flex w-full h-full">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="w-full h-full flex-shrink-0 relative bg-cover bg-center bg-no-repeat"
              style={{ 
                backgroundImage: `url(${item.image})`,
                backgroundColor: item.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              {/* 배경 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20"></div>
              
              {/* 콘텐츠 */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 max-w-4xl">
                  <div className="text-white">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
                      {item.title}
                    </h1>
                    <p className="text-xl md:text-3xl mb-8 animate-fade-in-delay text-gray-100">
                      {item.subtitle}
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-white text-gray-900 hover:bg-gray-100 animate-fade-in-delay-2 text-lg px-8 py-4 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => window.location.href = item.buttonLink}
                    >
                      {item.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 네비게이션 화살표 */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </>
      )}

      {/* 도트 네비게이션 */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75 hover:scale-110'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}

      {/* 진행률 바 */}
      {autoPlay && items.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear shadow-lg"
            style={{
              width: `${((currentIndex + 1) / items.length) * 100}%`
            }}
          />
        </div>
      )}
    </div>
  )
}
