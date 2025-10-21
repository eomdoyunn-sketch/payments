'use client'

import React from 'react'
import { AlertTriangle, Wrench, Ruler, Droplets, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface InstallCostBlockProps {
  className?: string
}

export function InstallCostBlock({ className }: InstallCostBlockProps) {
  return (
    <Card className={`border-amber-200 bg-amber-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <AlertTriangle className="w-5 h-5" />
          설치비/추가비 안내
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 표준설치 포함 범위 */}
        <div className="bg-white p-4 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            표준설치 포함 범위
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• 기본 배관 5m (실내기-실외기 연결)</li>
            <li>• 벽면 타공 1회 (직경 80mm 이하)</li>
            <li>• 기본 전원 연결 (220V)</li>
            <li>• 기본 배수 연결</li>
            <li>• 기본 설치 및 테스트</li>
          </ul>
        </div>

        {/* 추가비용 안내 */}
        <div className="bg-white p-4 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-orange-600" />
            추가비용 안내
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">배관 추가 (1m당)</span>
              <Badge variant="outline" className="text-orange-600">15,000원</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">천정 타공 추가</span>
              <Badge variant="outline" className="text-orange-600">30,000원</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">배수펌프 설치</span>
              <Badge variant="outline" className="text-orange-600">50,000원</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm">전원 공사</span>
              <Badge variant="outline" className="text-orange-600">현장 견적</Badge>
            </div>
          </div>
        </div>

        {/* 현장 환경 안내 */}
        <div className="bg-white p-4 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-600" />
            현장 환경 고지사항
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p className="flex items-start gap-2">
              <Droplets className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>현장 환경(전기용량, 배관 동선, 배수 시설 등)에 따라 추가비용이 발생할 수 있습니다.</span>
            </p>
            <p className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>설치 전 현장 조사 후 기사가 안내드리며, 고객 동의 하에 진행됩니다.</span>
            </p>
          </div>
        </div>

        {/* 법적 고지사항 */}
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <p className="text-xs text-red-700 text-center">
            ※ 위 가격은 2024년 기준이며, 현장 상황에 따라 변동될 수 있습니다.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

