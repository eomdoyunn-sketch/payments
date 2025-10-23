"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Zap, Database, Wifi, WifiOff } from "lucide-react"

type PerformanceMetrics = {
  realtimeConnected: boolean
  pendingChanges: number
  isSaving: boolean
  cacheSize: number
  networkRequests: number
  lastUpdate: Date | null
}

type PerformanceIndicatorProps = {
  metrics: PerformanceMetrics
  onClearCache?: () => void
  onForceRefresh?: () => void
}

export function PerformanceIndicator({ 
  metrics, 
  onClearCache, 
  onForceRefresh 
}: PerformanceIndicatorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const getStatusColor = (connected: boolean) => {
    return connected ? "text-green-500" : "text-red-500"
  }

  const getStatusIcon = (connected: boolean) => {
    return connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            성능 모니터
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '접기' : '펼치기'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* 기본 상태 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>실시간 연결</span>
            <div className={`flex items-center gap-1 ${getStatusColor(metrics.realtimeConnected)}`}>
              {getStatusIcon(metrics.realtimeConnected)}
              <span className="text-xs">
                {metrics.realtimeConnected ? '연결됨' : '연결 끊김'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>저장 대기</span>
            <Badge variant={metrics.pendingChanges > 0 ? "secondary" : "outline"}>
              {metrics.pendingChanges}개
            </Badge>
          </div>

          {metrics.isSaving && (
            <div className="flex items-center justify-between text-sm">
              <span>저장 중</span>
              <Badge variant="default">
                <Zap className="h-3 w-3 mr-1 animate-pulse" />
                처리 중...
              </Badge>
            </div>
          )}
        </div>

        {/* 상세 정보 (펼쳤을 때) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>캐시 크기</span>
              <Badge variant="outline">{metrics.cacheSize}개</Badge>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>네트워크 요청</span>
              <Badge variant="outline">{metrics.networkRequests}회</Badge>
            </div>

            {metrics.lastUpdate && (
              <div className="flex items-center justify-between text-sm">
                <span>마지막 업데이트</span>
                <span className="text-xs text-muted-foreground">
                  {metrics.lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex gap-2 pt-2">
              {onClearCache && (
                <Button size="sm" variant="outline" onClick={onClearCache}>
                  <Database className="h-3 w-3 mr-1" />
                  캐시 정리
                </Button>
              )}
              {onForceRefresh && (
                <Button size="sm" variant="outline" onClick={onForceRefresh}>
                  <Activity className="h-3 w-3 mr-1" />
                  새로고침
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * 성능 지표를 관리하는 훅
 */
export function usePerformanceMetrics() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    realtimeConnected: false,
    pendingChanges: 0,
    isSaving: false,
    cacheSize: 0,
    networkRequests: 0,
    lastUpdate: null
  })

  const updateMetrics = React.useCallback((updates: Partial<PerformanceMetrics>) => {
    setMetrics(prev => ({
      ...prev,
      ...updates,
      lastUpdate: new Date()
    }))
  }, [])

  const incrementNetworkRequests = React.useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      networkRequests: prev.networkRequests + 1,
      lastUpdate: new Date()
    }))
  }, [])

  const updatePendingChanges = React.useCallback((count: number) => {
    setMetrics(prev => ({
      ...prev,
      pendingChanges: count,
      lastUpdate: new Date()
    }))
  }, [])

  const setSaving = React.useCallback((saving: boolean) => {
    setMetrics(prev => ({
      ...prev,
      isSaving: saving,
      lastUpdate: new Date()
    }))
  }, [])

  const setRealtimeStatus = React.useCallback((connected: boolean) => {
    setMetrics(prev => ({
      ...prev,
      realtimeConnected: connected,
      lastUpdate: new Date()
    }))
  }, [])

  return {
    metrics,
    updateMetrics,
    incrementNetworkRequests,
    updatePendingChanges,
    setSaving,
    setRealtimeStatus
  }
}
