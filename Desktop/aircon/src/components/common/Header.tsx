'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BRANDS, CUSTOMER_SERVICE } from '@/lib/constants'

interface HeaderProps {
  className?: string
  variant?: 'default' | 'sticky' | 'transparent'
  showSearch?: boolean
  showUserMenu?: boolean
  showCart?: boolean
}

export function Header({
  className = '',
  variant = 'default',
  showSearch = true,
  showUserMenu = true,
  showCart = true,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartCount = 3 // 임시 데이터

  const headerClasses = {
    default: 'bg-white shadow-sm',
    sticky: 'bg-white shadow-sm sticky top-0 z-50',
    transparent: 'bg-transparent absolute top-0 left-0 right-0 z-50',
  }

  return (
    <header className={`${headerClasses[variant]} ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* 로고 */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">AZ</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-900">AirZone</span>
                <span className="text-xs text-gray-500 -mt-1">에어컨 전문몰</span>
              </div>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              {BRANDS.slice(0, 4).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* 검색바 */}
          {showSearch && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="에어컨 모델명, 브랜드를 검색해보세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          )}

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-2">
            {showUserMenu && (
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="w-5 h-5" />
              </Button>
            )}
            
            {showCart && (
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* 모바일 메뉴 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* 모바일 검색바 */}
        {showSearch && (
          <div className="md:hidden py-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="에어컨 모델명, 브랜드를 검색해보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        )}

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {BRANDS.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/brands/${brand.id}`}
                    className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <Link href="/login" className="block text-sm font-medium text-gray-700 hover:text-primary">
                    로그인
                  </Link>
                  <Link href="/register" className="block text-sm font-medium text-gray-700 hover:text-primary">
                    회원가입
                  </Link>
                  <Link href="/customer-service" className="block text-sm font-medium text-gray-700 hover:text-primary">
                    고객센터
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
