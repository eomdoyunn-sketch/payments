'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    let supabase
    try {
      supabase = createClient()
    } catch (error) {
      console.error('Supabase 클라이언트 생성 실패:', error)
      setAuthState({ 
        user: null, 
        loading: false, 
        error: '인증 시스템 초기화에 실패했습니다.' 
      })
      return
    }

    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('세션 확인 오류:', error)
          setAuthState({ user: null, loading: false, error: error.message })
          return
        }

        setAuthState({
          user: session?.user || null,
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('초기 세션 확인 중 오류:', error)
        setAuthState({ user: null, loading: false, error: '인증 상태를 확인할 수 없습니다.' })
      }
    }

    getInitialSession()

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        setAuthState({
          user: session?.user || null,
          loading: false,
          error: null
        })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return authState
}
