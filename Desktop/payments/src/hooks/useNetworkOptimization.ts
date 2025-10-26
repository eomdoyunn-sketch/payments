import { useState, useCallback, useRef } from 'react'

/**
 * 네트워크 요청 최적화 훅
 * - 요청 중복 방지
 * - 캐싱 및 재사용
 * - 에러 처리 및 재시도
 */
export function useNetworkOptimization() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const requestCache = useRef<Map<string, { data: unknown; timestamp: number }>>(new Map())
  const activeRequests = useRef<Set<string>>(new Set())

  // 캐시 유효 시간 (5분)
  const CACHE_DURATION = 5 * 60 * 1000

  const isCacheValid = useCallback((timestamp: number) => {
    return Date.now() - timestamp < CACHE_DURATION
  }, [])

  const getCachedData = useCallback((key: string) => {
    const cached = requestCache.current.get(key)
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.data
    }
    return null
  }, [isCacheValid])

  const setCachedData = useCallback((key: string, data: unknown) => {
    requestCache.current.set(key, {
      data,
      timestamp: Date.now()
    })
  }, [])

  const clearCache = useCallback((key?: string) => {
    if (key) {
      requestCache.current.delete(key)
    } else {
      requestCache.current.clear()
    }
  }, [])

  const optimizedRequest = useCallback(async <T>(
    key: string,
    requestFn: () => Promise<T>,
    options: {
      useCache?: boolean
      retryCount?: number
      retryDelay?: number
    } = {}
  ): Promise<T> => {
    const { useCache = true, retryCount = 3, retryDelay = 1000 } = options

    // 중복 요청 방지
    if (activeRequests.current.has(key)) {
      throw new Error('이미 진행 중인 요청입니다')
    }

    // 캐시된 데이터 확인
    if (useCache) {
      const cachedData = getCachedData(key)
      if (cachedData) {
        console.log(`📦 캐시된 데이터 사용: ${key}`)
        return cachedData
      }
    }

    activeRequests.current.add(key)
    setLoading(true)
    setError(null)

    try {
      let lastError: Error | null = null

      for (let attempt = 0; attempt <= retryCount; attempt++) {
        try {
          console.log(`🌐 네트워크 요청: ${key} (시도 ${attempt + 1}/${retryCount + 1})`)
          
          const data = await requestFn()
          
          // 성공 시 캐시에 저장
          if (useCache) {
            setCachedData(key, data)
          }
          
          setLoading(false)
          return data

        } catch (error) {
          lastError = error as Error
          console.error(`❌ 요청 실패: ${key} (시도 ${attempt + 1})`, error)
          
          if (attempt < retryCount) {
            console.log(`⏳ 재시도 대기: ${retryDelay}ms`)
            await new Promise(resolve => setTimeout(resolve, retryDelay))
          }
        }
      }

      // 모든 재시도 실패
      setError(lastError?.message || '네트워크 요청에 실패했습니다')
      setLoading(false)
      throw lastError
    } finally {
      activeRequests.current.delete(key)
    }
  }, [getCachedData, setCachedData])

  return {
    loading,
    error,
    optimizedRequest,
    clearCache,
    isRequestActive: (key: string) => activeRequests.current.has(key)
  }
}

/**
 * API 엔드포인트별 최적화된 요청 훅
 */
export function useOptimizedAPI() {
  const { loading, error, optimizedRequest, clearCache } = useNetworkOptimization()

  // 회사 목록 조회
  const fetchCompanies = useCallback(async () => {
    return optimizedRequest('companies', async () => {
      const response = await fetch('/api/companies')
      if (!response.ok) throw new Error('회사 목록을 불러올 수 없습니다')
      return response.json()
    })
  }, [optimizedRequest])

  // 결제 내역 조회
  const fetchPayments = useCallback(async (filters?: Record<string, unknown>) => {
    const cacheKey = `payments-${JSON.stringify(filters || {})}`
    return optimizedRequest(cacheKey, async () => {
      const params = new URLSearchParams(filters || {})
      const response = await fetch(`/api/payments?${params}`)
      if (!response.ok) throw new Error('결제 내역을 불러올 수 없습니다')
      return response.json()
    })
  }, [optimizedRequest])

  // 통계 조회
  const fetchStats = useCallback(async () => {
    return optimizedRequest('stats', async () => {
      const response = await fetch('/api/stats')
      if (!response.ok) throw new Error('통계를 불러올 수 없습니다')
      return response.json()
    })
  }, [optimizedRequest])

  // 설정 조회
  const fetchSettings = useCallback(async () => {
    return optimizedRequest('settings', async () => {
      const response = await fetch('/api/settings')
      if (!response.ok) throw new Error('설정을 불러올 수 없습니다')
      return response.json()
    })
  }, [optimizedRequest])

  return {
    loading,
    error,
    fetchCompanies,
    fetchPayments,
    fetchStats,
    fetchSettings,
    clearCache
  }
}

/**
 * 배치 요청 최적화 훅
 */
export function useBatchRequests() {
  const [pendingRequests, setPendingRequests] = useState<Map<string, () => Promise<unknown>>>(new Map())
  const [isProcessing, setIsProcessing] = useState(false)

  const addRequest = useCallback((key: string, requestFn: () => Promise<unknown>) => {
    setPendingRequests(prev => new Map(prev).set(key, requestFn))
  }, [])

  const processBatch = useCallback(async () => {
    if (pendingRequests.size === 0) return

    setIsProcessing(true)
    try {
      const requests = Array.from(pendingRequests.values())
      const results = await Promise.allSettled(requests.map(fn => fn()))
      
      // 성공한 요청들만 결과 반환
      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<unknown> => result.status === 'fulfilled')
        .map(result => result.value)

      setPendingRequests(new Map())
      return successfulResults

    } catch (error) {
      console.error('배치 요청 실패:', error)
      throw error
    } finally {
      setIsProcessing(false)
    }
  }, [pendingRequests])

  return {
    addRequest,
    processBatch,
    isProcessing,
    pendingCount: pendingRequests.size
  }
}
