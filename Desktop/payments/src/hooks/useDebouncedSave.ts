import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'

/**
 * 디바운스된 저장 훅
 * - 여러 변경사항을 일괄 처리
 * - 네트워크 요청 최적화
 * - 사용자 경험 향상
 */
export function useDebouncedSave<T>(
  saveFunction: (changes: Map<string, T>) => Promise<void>,
  delay: number = 2000
) {
  const [pendingChanges, setPendingChanges] = useState<Map<string, T>>(new Map())
  const [isSaving, setIsSaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedSave = useCallback(
    (changes: Map<string, T>) => {
      // 기존 타이머 취소
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // 새 타이머 설정
      timeoutRef.current = setTimeout(async () => {
        if (changes.size === 0) return

        setIsSaving(true)
        try {
          await saveFunction(changes)
          setPendingChanges(new Map())
          toast.success(`${changes.size}개 항목이 저장되었습니다`)
        } catch (error) {
          console.error('저장 실패:', error)
          toast.error('저장에 실패했습니다')
        } finally {
          setIsSaving(false)
        }
      }, delay)
    },
    [saveFunction, delay]
  )

  const addChange = useCallback(
    (id: string, data: T) => {
      const newChanges = new Map(pendingChanges)
      newChanges.set(id, data)
      setPendingChanges(newChanges)
      debouncedSave(newChanges)
    },
    [pendingChanges, debouncedSave]
  )

  const clearChanges = useCallback(() => {
    setPendingChanges(new Map())
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  const saveNow = useCallback(async () => {
    if (pendingChanges.size === 0) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsSaving(true)
    try {
      await saveFunction(pendingChanges)
      setPendingChanges(new Map())
      toast.success('변경사항이 저장되었습니다')
    } catch (error) {
      console.error('즉시 저장 실패:', error)
      toast.error('저장에 실패했습니다')
    } finally {
      setIsSaving(false)
    }
  }, [pendingChanges, saveFunction])

  return {
    pendingChanges,
    isSaving,
    addChange,
    clearChanges,
    saveNow,
    pendingCount: pendingChanges.size
  }
}

/**
 * 회사 상태 변경용 디바운스 훅
 */
export function useCompanyStatusDebounce() {
  const [companyChanges, setCompanyChanges] = useState<Map<string, { status: 'active' | 'inactive' }>>(new Map())

  const saveCompanyChanges = useCallback(async (changes: Map<string, { status: 'active' | 'inactive' }>) => {
    try {
      console.log('💾 회사 상태 변경 저장 시작:', Array.from(changes.entries()))
      
      const { toggleCompanyStatus } = await import('@/app/actions/companies')
      
      // 각 변경사항을 순차적으로 처리 (에러 발생 시 개별 처리)
      const results = await Promise.allSettled(
        Array.from(changes.entries()).map(async ([code, data]) => {
          console.log(`🔄 회사 상태 변경: ${code} -> ${data.status}`)
          return await toggleCompanyStatus(code, data.status)
        })
      )
      
      // 실패한 요청들 로깅
      const failures = results.filter(result => result.status === 'rejected')
      if (failures.length > 0) {
        console.error('❌ 일부 회사 상태 변경 실패:', failures)
        failures.forEach((failure, index) => {
          if (failure.status === 'rejected') {
            console.error(`실패 ${index + 1}:`, failure.reason)
          }
        })
      }
      
      const successCount = results.filter(result => result.status === 'fulfilled').length
      console.log(`✅ 회사 상태 변경 완료: ${successCount}/${results.length} 성공`)
      
    } catch (error) {
      console.error('❌ 회사 상태 저장 실패:', error)
      throw error
    }
  }, [])

  return useDebouncedSave(saveCompanyChanges, 1500)
}

/**
 * 결제 상태 변경용 디바운스 훅
 */
export function usePaymentStatusDebounce() {
  const savePaymentChanges = useCallback(async (changes: Map<string, { processed: boolean }>) => {
    try {
      const { updatePaymentProcessed } = await import('@/app/actions/payments')
      
      await Promise.all(
        Array.from(changes.entries()).map(([id, data]) => 
          updatePaymentProcessed([id], data.processed)
        )
      )
    } catch (error) {
      console.error('결제 상태 저장 실패:', error)
      throw error
    }
  }, [])

  return useDebouncedSave(savePaymentChanges, 1000)
}
