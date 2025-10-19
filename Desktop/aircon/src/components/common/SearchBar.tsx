'use client'

import React, { useState, useRef } from 'react'
import { Search, Mic, QrCode, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  showFilters?: boolean
  showVoiceSearch?: boolean
  showQRScan?: boolean
  suggestions?: string[]
  className?: string
}

export function SearchBar({
  placeholder = '에어컨 모델명, 브랜드를 검색해보세요',
  value = '',
  onChange,
  onSearch,
  showFilters = false,
  showVoiceSearch = true,
  showQRScan = true,
  suggestions = [],
  className = '',
}: SearchBarProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // 인기 검색어 (임시 데이터)
  const popularSearches = [
    '삼성 에어컨',
    'LG 인버터',
    '벽걸이형',
    '1.5kW',
    '스마트 에어컨',
  ]

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // 검색 히스토리에 추가
      const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 5)
      setSearchHistory(newHistory)
      
      onSearch?.(query)
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange?.(newValue)
    setShowSuggestions(newValue.length > 0)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(value)
    }
  }

  const handleVoiceSearch = () => {
    // 음성 검색 기능 (실제 구현 시 Web Speech API 사용)
    console.log('음성 검색 시작')
  }

  const handleQRScan = () => {
    // QR 스캔 기능 (실제 구현 시 QR 스캔 라이브러리 사용)
    console.log('QR 스캔 시작')
  }

  const handleSuggestionClick = (suggestion: string) => {
    onChange?.(suggestion)
    handleSearch(suggestion)
  }

  const handleClearSearch = () => {
    onChange?.('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          className="pl-10 pr-20"
        />
        
        {/* 검색 아이콘 */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        
        {/* 액션 버튼들 */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {value && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          {showVoiceSearch && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleVoiceSearch}
              className="text-gray-400 hover:text-primary"
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
          
          {showQRScan && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleQRScan}
              className="text-gray-400 hover:text-primary"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          )}
          
          <Button
            onClick={() => handleSearch(value)}
            disabled={!value.trim()}
            size="sm"
            className="ml-1"
          >
            검색
          </Button>
        </div>
      </div>

      {/* 검색 제안 */}
      {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0 || popularSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
          <div className="p-4">
            {/* 검색 히스토리 */}
            {searchHistory.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">최근 검색어</div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-white"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 자동완성 제안 */}
            {suggestions.length > 0 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">검색 제안</div>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-md text-sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 인기 검색어 */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">인기 검색어</div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-white"
                    onClick={() => handleSuggestionClick(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 필터 옵션 */}
      {showFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            브랜드
          </Button>
          <Button variant="outline" size="sm">
            가격대
          </Button>
          <Button variant="outline" size="sm">
            용량
          </Button>
          <Button variant="outline" size="sm">
            기능
          </Button>
        </div>
      )}
    </div>
  )
}
