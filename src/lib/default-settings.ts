// 기본 전역 설정값
export type GlobalSettings = {
  membershipPrices: {
    fullDay: number
    morning: number
    evening: number
  }
  lockerPrice: number
  membershipPeriod: number  // 모든 회원권 공통 이용 기간
  lockerPeriod: number
  membershipStartDate: string  // 회원권 이용 시작 날짜
  lockerStartDate: string     // 사물함 이용 시작 날짜
  productStatus: {
    memberships: {
      fullDay: boolean
      morning: boolean
      evening: boolean
    }
    locker: boolean
  }
  registrationPeriod: {
    enabled: boolean
    startDate: string
    endDate: string
  }
  maxRegistrations: number
  companyAgreements: {
    global: {
      personal: { enabled: boolean; required: boolean }
      sensitive: { enabled: boolean; required: boolean }
      utilization: { enabled: boolean; required: boolean }
    }
    companies: {
      [key: string]: {
        personal: { enabled: boolean; required: boolean }
        sensitive: { enabled: boolean; required: boolean }
        utilization: { enabled: boolean; required: boolean }
      }
    }
  }
}

export const DEFAULT_SETTINGS: GlobalSettings = {
  membershipPrices: {
    fullDay: 33000,
    morning: 22000,
    evening: 22000,
  },
  lockerPrice: 27500,
  membershipPeriod: 3,  // 모든 회원권 공통 이용 기간: 3개월
  lockerPeriod: 3,
  membershipStartDate: '2025-01-01',  // 회원권 이용 시작 날짜
  lockerStartDate: '2025-01-01',     // 사물함 이용 시작 날짜
  productStatus: {
    memberships: {
      fullDay: true,
      morning: true,
      evening: true,
    },
    locker: true,
  },
  registrationPeriod: {
    enabled: false,
    startDate: '2025-01-01',
    endDate: '2025-12-31',
  },
  maxRegistrations: 700,
  companyAgreements: {
    global: {
      personal: { enabled: true, required: true },
      sensitive: { enabled: true, required: true },
      utilization: { enabled: false, required: false },
    },
    companies: {},
  },
}

