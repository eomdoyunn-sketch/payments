"use client"

import * as React from "react"

// 설정 타입 정의
export type Settings = {
  // 상품 가격 및 이용기간 설정 (통합)
  membershipPrices: {
    fullDay: number
    morning: number
    evening: number
  }
  // 모든 상품 공통 이용 기간 (개월수)
  membershipPeriod: number  // 모든 회원권의 이용 기간 (예: 3개월)
  lockerPrice: number // 개인사물함 가격
  lockerPeriod: number // 개인사물함 이용 기간 (개월수)
  
  // 이용 시작 날짜 설정
  membershipStartDate: string  // 회원권 이용 시작 날짜
  lockerStartDate: string     // 사물함 이용 시작 날짜
  
  // 상품 활성/비활성 설정
  productStatus: {
    memberships: {
      fullDay: boolean
      morning: boolean
      evening: boolean
    }
    locker: boolean
  }
  
  // 등록 기간 설정 (비활성화됨)
  registrationPeriod: {
    enabled: boolean
    startDate: string
    endDate: string
  }
  
  // 시스템 설정
  maxRegistrations: number
  
  // 동의서 설정
  agreements: {
    personal: { enabled: boolean; required: boolean }
    sensitive: { enabled: boolean; required: boolean }
    utilization: { enabled: boolean; required: boolean }
  }
  
  // 계열사별 동의서 설정
  companyAgreements: {
    default: {
      personal: { enabled: boolean; required: boolean }
      sensitive: { enabled: boolean; required: boolean }
      utilization: { enabled: boolean; required: boolean }
    }
    companies: Record<string, {
      personal: { enabled: boolean; required: boolean }
      sensitive: { enabled: boolean; required: boolean }
      utilization: { enabled: boolean; required: boolean }
    }>
  }
}

// 기본 설정값
const defaultSettings: Settings = {
  membershipPrices: {
    fullDay: 33000,
    morning: 33000,
    evening: 33000
  },
  membershipPeriod: 3,  // 모든 회원권 공통 이용 기간: 3개월
  lockerPrice: 16500,
  lockerPeriod: 3,
  membershipStartDate: '2025-01-01',  // 회원권 이용 시작 날짜
  lockerStartDate: '2025-01-01',     // 사물함 이용 시작 날짜
  productStatus: {
    memberships: {
      fullDay: true,
      morning: true,
      evening: true
    },
    locker: true
  },
  registrationPeriod: {
    enabled: false,  // 등록 기간 제한 비활성화
    startDate: "2025-01-01",
    endDate: "2025-12-31"
  },
  maxRegistrations: 700,
  agreements: {
    personal: { enabled: true, required: true },
    sensitive: { enabled: true, required: true },
    utilization: { enabled: true, required: false }
  },
  companyAgreements: {
    default: {
      personal: { enabled: true, required: true },
      sensitive: { enabled: true, required: true },
      utilization: { enabled: true, required: true }
    },
    companies: {
      "B01": {
        personal: { enabled: true, required: true },
        sensitive: { enabled: true, required: true },
        utilization: { enabled: true, required: true }
      },
      "B02": {
        personal: { enabled: true, required: true },
        sensitive: { enabled: false, required: false },
        utilization: { enabled: false, required: false }
      }
    }
  }
}

// Context 타입 정의
type SettingsContextType = {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
}

// Context 생성
const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined)

// Provider 컴포넌트
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // hydration 문제 해결을 위해 클라이언트에서만 localStorage 읽기
  const [settings, setSettings] = React.useState<Settings>(defaultSettings)
  const [isClient, setIsClient] = React.useState(false)
  
  // 클라이언트에서만 localStorage에서 설정 불러오기
  React.useEffect(() => {
    setIsClient(true)
    try {
      const savedSettings = localStorage.getItem('gym29-settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        
        // 등록 기간 제한 비활성화
        if (parsed.registrationPeriod) {
          parsed.registrationPeriod.enabled = false
          console.log('📅 등록 기간 제한 비활성화됨 - 계열사별 토글만 사용')
        }
        
        // 마스터 토글 삭제 처리 (기존 데이터 호환성)
        if (parsed.masterPaymentEnabled !== undefined) {
          delete parsed.masterPaymentEnabled
          console.log('🗑️ 마스터 결제 토글 제거됨 - 계열사별 활성 상태만 사용')
        }
        
        // membershipPeriods → membershipPeriod 마이그레이션
        if (parsed.membershipPeriods && !parsed.membershipPeriod) {
          parsed.membershipPeriod = parsed.membershipPeriods.fullDay || 3
          delete parsed.membershipPeriods
          delete parsed.globalUsagePeriod
          console.log('📦 이용기간 통합 완료')
        }
        
        // 시작 날짜 필드 추가 (기존 데이터 호환성)
        if (!parsed.membershipStartDate) {
          parsed.membershipStartDate = '2025-01-01'
          console.log('📅 회원권 시작 날짜 기본값 설정')
        }
        if (!parsed.lockerStartDate) {
          parsed.lockerStartDate = '2025-01-01'
          console.log('📅 사물함 시작 날짜 기본값 설정')
        }
        
        localStorage.setItem('gym29-settings', JSON.stringify(parsed))
        setSettings({ ...defaultSettings, ...parsed })
      }
    } catch (error) {
      console.error('설정 불러오기 실패:', error)
    }
  }, [])

  // 설정 업데이트 함수
  const updateSettings = React.useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updatedSettings = {
        ...prev,
        ...newSettings
      }
      
      // localStorage에 저장
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('gym29-settings', JSON.stringify(updatedSettings))
        } catch (error) {
          console.error('설정 저장 실패:', error)
        }
      }
      
      return updatedSettings
    })
  }, [])

  // 설정 리셋 함수
  const resetSettings = React.useCallback(() => {
    setSettings(defaultSettings)
    
    // localStorage에서 설정 제거
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('gym29-settings')
      } catch (error) {
        console.error('설정 리셋 실패:', error)
      }
    }
  }, [])

  const value = React.useMemo(() => ({
    settings,
    updateSettings,
    resetSettings
  }), [settings, updateSettings, resetSettings])

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

// Hook
export function useSettings() {
  const context = React.useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
