import { useState, useCallback, useMemo } from 'react'

/**
 * 최적화된 상태 관리 훅
 * - 선택적 상태 업데이트
 * - 불필요한 리렌더링 방지
 * - 메모리 효율성 향상
 */
export function useOptimizedState<T extends { id: string | number }>(
  initialData: T[]
) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 개별 항목 업데이트
  const updateItem = useCallback((id: string | number, updates: Partial<T>) => {
    setData(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ))
  }, [])

  // 여러 항목 일괄 업데이트
  const updateItems = useCallback((updates: Array<{ id: string | number; data: Partial<T> }>) => {
    setData(prev => {
      const updateMap = new Map(updates.map(u => [u.id, u.data]))
      return prev.map(item => 
        updateMap.has(item.id) ? { ...item, ...updateMap.get(item.id) } : item
      )
    })
  }, [])

  // 항목 추가
  const addItem = useCallback((item: T) => {
    setData(prev => [...prev, item])
  }, [])

  // 항목 삭제
  const removeItem = useCallback((id: string | number) => {
    setData(prev => prev.filter(item => item.id !== id))
  }, [])

  // 전체 데이터 교체
  const setAllData = useCallback((newData: T[]) => {
    setData(newData)
  }, [])

  // 메모이제이션된 데이터 (필요한 필드만 추출)
  const memoizedData = useMemo(() => 
    data.map(item => ({
      id: item.id,
      ...item
    })), [data]
  )

  return {
    data: memoizedData,
    loading,
    error,
    setLoading,
    setError,
    updateItem,
    updateItems,
    addItem,
    removeItem,
    setAllData
  }
}

/**
 * 회사 데이터 최적화 훅
 */
export function useOptimizedCompanies(initialCompanies: any[]) {
  const {
    data: companies,
    loading,
    error,
    updateItem: updateCompany,
    setAllData: setCompanies
  } = useOptimizedState(initialCompanies)

  // 회사 상태 토글 (즉시 UI 업데이트)
  const toggleCompanyStatus = useCallback((id: string | number, status: 'active' | 'inactive') => {
    updateCompany(id, { status })
  }, [updateCompany])

  // 회사 정보 업데이트
  const updateCompanyInfo = useCallback((id: string | number, updates: any) => {
    updateCompany(id, updates)
  }, [updateCompany])

  return {
    companies,
    loading,
    error,
    toggleCompanyStatus,
    updateCompanyInfo,
    setCompanies
  }
}

/**
 * 결제 데이터 최적화 훅
 */
export function useOptimizedPayments(initialPayments: any[]) {
  const {
    data: payments,
    loading,
    error,
    updateItem: updatePayment,
    setAllData: setPayments
  } = useOptimizedState(initialPayments)

  // 결제 상태 토글 (즉시 UI 업데이트)
  const togglePaymentStatus = useCallback((id: string | number, processed: boolean) => {
    updatePayment(id, { processed })
  }, [updatePayment])

  // 사물함 번호 업데이트
  const updateLockerNumber = useCallback((id: string | number, lockerNumber: string) => {
    updatePayment(id, { locker_number: lockerNumber })
  }, [updatePayment])

  // 메모 업데이트
  const updateMemo = useCallback((id: string | number, memo: string) => {
    updatePayment(id, { memo })
  }, [updatePayment])

  return {
    payments,
    loading,
    error,
    togglePaymentStatus,
    updateLockerNumber,
    updateMemo,
    setPayments
  }
}

/**
 * 설정 데이터 최적화 훅
 */
export function useOptimizedSettings(initialSettings: any) {
  const [settings, setSettings] = useState(initialSettings)
  const [loading, setLoading] = useState(false)

  // 설정 업데이트 (즉시 UI 업데이트)
  const updateSettings = useCallback((updates: any) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }, [])

  // 설정 일괄 업데이트
  const setAllSettings = useCallback((newSettings: any) => {
    setSettings(newSettings)
  }, [])

  return {
    settings,
    loading,
    setLoading,
    updateSettings,
    setAllSettings
  }
}
