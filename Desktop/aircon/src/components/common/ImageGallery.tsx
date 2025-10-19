'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)

  const mainImage = images[selectedIndex] || images[0]

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* 메인 이미지 */}
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden group">
        <img
          src={mainImage}
          alt={`${productName} ${selectedIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* 줌 버튼 */}
        <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogTitle className="sr-only">{productName} 이미지 확대</DialogTitle>
            <div className="relative">
              <img
                src={mainImage}
                alt={`${productName} 확대`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              {/* 네비게이션 버튼 */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* 네비게이션 버튼 */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
      
      {/* 썸네일 */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                selectedIndex === index
                  ? 'border-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <img
                src={image}
                alt={`${productName} 썸네일 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
