'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  companyName?: string
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

    // 사용자 프로필에서 company_name 가져오기
    const getUserProfile = async (userId: string) => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('company_name')
          .eq('id', userId)
          .single()

        if (profileError) {
          console.error('프로필 조회 오류:', profileError)
          return null
        }

        return profile?.company_name || null
      } catch (error) {
        console.error('프로필 조회 중 오류:', error)
        return null
      }
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

        const companyName = session?.user ? await getUserProfile(session.user.id) : null

        setAuthState({
          user: session?.user || null,
          loading: false,
          error: null,
          companyName: companyName || undefined
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
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('사용자 로그인', session.user.email)
        } else if (event === 'SIGNED_OUT') {
          console.log('사용자 로그아웃')
        }
        
        const companyName = session?.user ? await getUserProfile(session.user.id) : null
        
        setAuthState({
          user: session?.user || null,
          loading: false,
          error: null,
          companyName: companyName || undefined
        })
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return authState
}
