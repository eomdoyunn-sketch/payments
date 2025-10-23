"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RefreshCw, Search } from "lucide-react"

type PaymentFilters = {
  company: string
  status: string
  processed: string
  search: string
}

type PaymentFiltersProps = {
  filters: PaymentFilters
  onFiltersChange: (filters: PaymentFilters) => void
  onRefresh: () => void
  loading: boolean
}

export function PaymentFilters({
  filters,
  onFiltersChange,
  onRefresh,
  loading
}: PaymentFiltersProps) {
  const handleFilterChange = (key: keyof PaymentFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      company: 'all',
      status: 'all',
      processed: 'all',
      search: ''
    })
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* 검색 */}
      <div className="space-y-2">
        <Label htmlFor="search">검색</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="이름, 사번, 회사명으로 검색"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* 회사 필터 */}
      <div className="space-y-2">
        <Label htmlFor="company">회사</Label>
        <Select
          value={filters.company}
          onValueChange={(value) => handleFilterChange('company', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="회사 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="삼성전자">삼성전자</SelectItem>
            <SelectItem value="삼성SDI">삼성SDI</SelectItem>
            <SelectItem value="삼성E&A">삼성E&A</SelectItem>
            <SelectItem value="호텔신라">호텔신라</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 결제 상태 필터 */}
      <div className="space-y-2">
        <Label htmlFor="status">결제 상태</Label>
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
            <SelectItem value="pending">대기</SelectItem>
            <SelectItem value="cancelled">취소</SelectItem>
            <SelectItem value="refunded">환불</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 처리 상태 필터 */}
      <div className="space-y-2">
        <Label htmlFor="processed">처리 상태</Label>
        <Select
          value={filters.processed}
          onValueChange={(value) => handleFilterChange('processed', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="처리 상태 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="true">처리완료</SelectItem>
            <SelectItem value="false">미처리</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-end gap-2">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex-1"
        >
          필터 초기화
        </Button>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="flex-1"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </Button>
      </div>
    </div>
  )
}

