import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

/**
 * 최적화된 실시간 구독 훅
 * - 페이지 가시성 감지로 백그라운드에서 구독 중단
 * - 필요한 테이블만 선택적 구독
 * - 선택적 상태 업데이트로 전체 새로고침 방지
 */
export function useOptimizedRealtime() {
  const [isVisible, setIsVisible] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  // 페이지 가시성 감지
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden
      setIsVisible(visible)
      console.log(`📱 페이지 가시성: ${visible ? '활성' : '비활성'}`)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return {
    isVisible,
    isConnected,
    setIsConnected
  }
}

/**
 * 최적화된 실시간 구독 설정
 */
export function useRealtimeSubscription(
  onCompanyUpdate: (payload: any) => void,
  onPaymentUpdate: (payload: any) => void,
  onSettingsUpdate: (payload: any) => void,
  options: { enabled?: boolean } = { enabled: true }
) {
  const { isVisible, isConnected, setIsConnected } = useOptimizedRealtime()

  // 콜백 함수들을 메모이제이션하여 불필요한 재구독 방지
  const memoizedOnCompanyUpdate = useCallback(onCompanyUpdate, [])
  const memoizedOnPaymentUpdate = useCallback(onPaymentUpdate, [])
  const memoizedOnSettingsUpdate = useCallback(onSettingsUpdate, [])

  useEffect(() => {
    if (!options.enabled) {
      console.log('🚫 실시간 구독 비활성화됨')
      return
    }

    if (!isVisible) {
      console.log('⏸️ 백그라운드 모드 - 실시간 구독 일시 중단')
      return
    }

    // 실시간 구독을 임시로 비활성화 (오류 방지)
    console.log('🚫 실시간 구독 임시 비활성화 (오류 방지)')
    return

    const supabase = createClient()
    let channel: any = null
    let isSubscribed = false

    const setupRealtime = async () => {
      try {
        // 연결 상태 확인
        const { data, error } = await supabase.from('companies').select('id').limit(1)
        if (error) throw error

        setIsConnected(true)
        console.log('🔗 실시간 구독 시작')

        // 최적화된 실시간 채널 생성 (재연결 설정 추가)
        channel = supabase
          .channel('admin-optimized-updates', {
            config: {
              broadcast: { self: false },
              presence: { key: 'admin' },
              realtime: {
                heartbeat_interval: 30000, // 30초마다 heartbeat
                reconnect_after: [1000, 2000, 5000, 10000] // 재연결 시도 간격
              }
            }
          })
          // 회사 정보 변경 (UPDATE만 감지)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'companies'
            },
            (payload) => {
              try {
                console.log('🏢 회사 정보 업데이트:', payload.new)
                memoizedOnCompanyUpdate(payload.new)
              } catch (error) {
                console.error('❌ 회사 업데이트 핸들러 오류:', error)
              }
            }
          )
          // 결제 정보 변경 (UPDATE만 감지)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'payments'
            },
            (payload) => {
              try {
                console.log('💳 결제 정보 업데이트:', payload.new)
                memoizedOnPaymentUpdate(payload.new)
              } catch (error) {
                console.error('❌ 결제 업데이트 핸들러 오류:', error)
              }
            }
          )
          // 설정 변경 (UPDATE만 감지)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'global_settings'
            },
            (payload) => {
              try {
                console.log('⚙️ 설정 업데이트:', payload.new)
                memoizedOnSettingsUpdate(payload.new)
              } catch (error) {
                console.error('❌ 설정 업데이트 핸들러 오류:', error)
              }
            }
          )
          .subscribe((status, err) => {
            console.log('📡 실시간 구독 상태:', status)
            
            if (err) {
              console.error('❌ 실시간 구독 오류 상세:', err)
            }
            
            switch (status) {
              case 'SUBSCRIBED':
                isSubscribed = true
                console.log('✅ 실시간 구독 성공')
                // toast.success('실시간 업데이트가 활성화되었습니다')
                break
              case 'CHANNEL_ERROR':
                isSubscribed = false
                console.error('❌ 실시간 구독 오류')
                // toast.error('실시간 연결에 문제가 있습니다')
                break
              case 'TIMED_OUT':
                isSubscribed = false
                console.warn('⏰ 실시간 구독 시간 초과')
                // toast.warning('실시간 연결이 시간 초과되었습니다')
                break
              case 'CLOSED':
                isSubscribed = false
                console.log('🔒 실시간 구독 종료')
                break
            }
          })

      } catch (error) {
        console.error('❌ 실시간 구독 설정 실패:', error)
        setIsConnected(false)
        // toast.error('실시간 연결에 실패했습니다')
      }
    }

    setupRealtime()

    // 클린업
    return () => {
      if (channel && isSubscribed) {
        try {
          supabase.removeChannel(channel)
          console.log('🧹 실시간 구독 정리')
        } catch (error) {
          console.error('❌ 실시간 구독 정리 중 오류:', error)
        }
      }
    }
  }, [isVisible, memoizedOnCompanyUpdate, memoizedOnPaymentUpdate, memoizedOnSettingsUpdate])

  return { isConnected }
}
