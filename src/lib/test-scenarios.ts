/**
 * GYM29 Test Scenarios
 * 
 * 핵심 시나리오 8가지 테스트 케이스
 */

import { Settings } from "@/contexts/SettingsContext"
import { runAllGuards } from "./payment-guards"

export type TestScenario = {
  id: string
  name: string
  description: string
  setup: () => any
  expectedResult: {
    canPass: boolean
    reasonContains?: string
  }
}

// 기본 설정
const createDefaultSettings = (): Settings => ({
  membershipPrices: {
    fullDay: 33000,
    morning: 33000,
    evening: 33000
  },
  membershipPeriod: 3,
  membershipStartDate: '2025-01-01',
  lockerStartDate: '2025-01-01',
  lockerPrice: 16500,
  lockerPeriod: 3,
  productStatus: {
    memberships: {
      fullDay: true,
      morning: true,
      evening: true
    },
    locker: true
  },
  registrationPeriod: {
    enabled: true,
    startDate: "2025-01-10",
    endDate: "2025-01-15"
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
    companies: {}
  }
})

// 기본 회사 정보 (이미지의 16개 계열사 데이터 기반)
const createDefaultCompany = () => ({
  id: "B01",
  name: "솔루션 전략",
  mode: "FCFS" as const,
  remaining: 25, // 배분회원수 76명 - 결제유효수 51명 = 25명 잔여
  availableFrom: new Date("2025-01-10"),
  availableUntil: new Date("2025-01-15")
})

// 계열사별 등록 현황 데이터 (이미지의 16개 계열사 기반)
export const companyRegistrationData = [
  { 
    id: "B01", 
    name: "솔루션 전략", 
    mode: "FCFS",
    allocations: { fullDay: 47, morning: 0, evening: 4 },
    registrations: { fullDay: 47, morning: 0, evening: 4 },
    isActive: true
  },
  { 
    id: "B02", 
    name: "솔루션 케미칼", 
    mode: "FCFS",
    allocations: { fullDay: 45, morning: 8, evening: 18 },
    registrations: { fullDay: 45, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B03", 
    name: "솔루션 큐셀", 
    mode: "FCFS",
    allocations: { fullDay: 44, morning: 0, evening: 0 },
    registrations: { fullDay: 44, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B04", 
    name: "건설", 
    mode: "FCFS",
    allocations: { fullDay: 57, morning: 4, evening: 9 },
    registrations: { fullDay: 57, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B05", 
    name: "전략,지원", 
    mode: "FCFS",
    allocations: { fullDay: 31, morning: 2, evening: 4 },
    registrations: { fullDay: 31, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B06", 
    name: "글로벌", 
    mode: "FCFS",
    allocations: { fullDay: 33, morning: 2, evening: 4 },
    registrations: { fullDay: 33, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B07", 
    name: "(주)한화오션", 
    mode: "FCFS",
    allocations: { fullDay: 71, morning: 4, evening: 8 },
    registrations: { fullDay: 71, morning: 3, evening: 7 },
    isActive: true
  },
  { 
    id: "B08", 
    name: "한화시스템", 
    mode: "FCFS",
    allocations: { fullDay: 43, morning: 2, evening: 6 },
    registrations: { fullDay: 43, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B09", 
    name: "한화에어로스페이스", 
    mode: "FCFS",
    allocations: { fullDay: 84, morning: 5, evening: 11 },
    registrations: { fullDay: 84, morning: 3, evening: 3 },
    isActive: true
  },
  { 
    id: "B10", 
    name: "한화솔루션/인사이트부문", 
    mode: "FCFS",
    allocations: { fullDay: 26, morning: 1, evening: 3 },
    registrations: { fullDay: 26, morning: 0, evening: 1 },
    isActive: true
  },
  { 
    id: "B11", 
    name: "한화임팩트", 
    mode: "FCFS",
    allocations: { fullDay: 14, morning: 1, evening: 3 },
    registrations: { fullDay: 14, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B12", 
    name: "한화첨단소재", 
    mode: "FCFS",
    allocations: { fullDay: 18, morning: 1, evening: 2 },
    registrations: { fullDay: 18, morning: 1, evening: 2 },
    isActive: true
  },
  { 
    id: "B13", 
    name: "한화에너지", 
    mode: "FCFS",
    allocations: { fullDay: 6, morning: 1, evening: 2 },
    registrations: { fullDay: 6, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B14", 
    name: "한화시스템/ICT부문", 
    mode: "FCFS",
    allocations: { fullDay: 0, morning: 0, evening: 0 },
    registrations: { fullDay: 0, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B15", 
    name: "(주)한화/인재경영원", 
    mode: "FCFS",
    allocations: { fullDay: 0, morning: 0, evening: 0 },
    registrations: { fullDay: 0, morning: 0, evening: 0 },
    isActive: true
  },
  { 
    id: "B16", 
    name: "한화비전(주)", 
    mode: "FCFS",
    allocations: { fullDay: 0, morning: 0, evening: 0 },
    registrations: { fullDay: 0, morning: 0, evening: 0 },
    isActive: true
  }
]

// 기본 상품 정보
const createDefaultProducts = () => [
  { id: "product-1", name: "종일권" },
  { id: "product-2", name: "오전권" },
  { id: "product-3", name: "저녁권" }
]

/**
 * 시나리오 1: 정상 결제 (모든 조건 만족)
 */
export const scenario1: TestScenario = {
  id: "S1",
  name: "정상 결제",
  description: "모든 조건을 만족하는 정상적인 결제 상황",
  setup: () => {
    const now = new Date("2025-01-12") // 기간 내
    const settings = createDefaultSettings()
    const company = createDefaultCompany()
    
    return runAllGuards({
      settings,
      userCompanyId: "B01",
      company,
      selectedProducts: ["product-1"],
      selectedLocker: true,
      agreementChecks: {
        personal: true,
        sensitive: true,
        utilization: true
      },
      isWHLVerified: false,
      products: createDefaultProducts()
    })
  },
  expectedResult: {
    canPass: true
  }
}

/**
 * 시나리오 2: 등록 기간 전
 */
export const scenario2: TestScenario = {
  id: "S2",
  name: "등록 기간 전",
  description: "등록 시작일 이전에 접근한 경우",
  setup: () => {
    const settings = createDefaultSettings()
    const company = {
      ...createDefaultCompany(),
      availableFrom: new Date("2025-01-20"), // 미래 날짜
      availableUntil: new Date("2025-01-25")
    }
    
    return runAllGuards({
      settings,
      userCompanyId: "B01",
      company,
      selectedProducts: ["product-1"],
      selectedLocker: false,
      agreementChecks: {
        personal: true,
        sensitive: true,
        utilization: true
      },
      isWHLVerified: false,
      products: createDefaultProducts()
    })
  },
  expectedResult: {
    canPass: false,
    reasonContains: "등록 기간 전"
  }
}

/**
 * 시나리오 3: 등록 기간 후
 */
export const scenario3: TestScenario = {
  id: "S3",
  name: "등록 기간 후",
  description: "등록 종료일 이후에 접근한 경우",
  setup: () => {
    const settings = createDefaultSettings()
    const company = {
      ...createDefaultCompany(),
      availableFrom: new Date("2024-12-01"),
      availableUntil: new Date("2024-12-31") // 과거 날짜
    }
    
    return runAllGuards({
      settings,
      userCompanyId: "B01",
      company,
      selectedProducts: ["product-1"],
      selectedLocker: false,
      agreementChecks: {
        personal: true,
        sensitive: true,
        utilization: true
      },
      isWHLVerified: false,
      products: createDefaultProducts()
    })
  },
  expectedResult: {
    canPass: false,
    reasonContains: "종료"
  }
}

/**
 * 시나리오 4: 상품 비활성화
 */
export const scenario4: TestScenario = {
  id: "S4",
  name: "상품 비활성화",
  description: "선택한 상품이 비활성화된 경우",
  setup: () => {
    const settings = createDefaultSettings()
    settings.productStatus.memberships.fullDay = false // 종일권 비활성
    const company = createDefaultCompany()
    
    return runAllGuards({
      settings,
      userCompanyId: "B01",
      company,
      selectedProducts: ["product-1"], // 종일권
      selectedLocker: false,
      agreementChecks: {
        personal: true,
        sensitive: true,
        utilization: true
      },
      isWHLVerified: false,
      products: createDefaultProducts()
    })
  },
  expectedResult: {
    canPass: false,
    reasonContains: "비활성"
  }
}

/**
 * 시나리오 5: 개인사물함 비활성화
 */
export const scenario5: TestScenario = {
  id: "S5",
  name: "개인사물함 비활성화",
  description: "개인사물함을 선택했지만 비활성화된 경우",
  setup: () => {
    const settings = createDefaultSettings()
    settings.productStatus.locker = false // 사물함 비활성
    const company = createDefaultCompany()
    
    return runAllGuards({
      settings,
      userCompanyId: "B01",
      company,
      selectedProducts: ["product-1"],
      selectedLocker: true, // 사물함 선택
      agreementChecks: {
        personal: true,
        sensitive: true,
        utilization: true
      },
      isWHLVerified: false,
      products: createDefaultProducts()
    })
  },
  expectedResult: {
    canPass: false,
    reasonContains: "사물함"
  }
}

/**
 * 시나리오 6: 필수 동의 미체크
 */
export const scenario6: TestScenario = {
  id: "S6",
  name: "필수 동의 미체크",
  description: "필수 동의서를 체크하지 않은 경우",
  setup: () => {
    const settings = createDefaultSettings()
    const company = createDefaultCompany()
    
    return runAllGuards({
      settings,
      userCompanyId: "B01",
      company,
      selectedProducts: ["product-1"],
      selectedLocker: false,
      agreementChecks: {
        personal: true,
        sensitive: false, // 필수 동의 미체크
        utilization: false
      },
      isWHLVerified: false,
      products: createDefaultProducts()
    })
  },
  expectedResult: {
    canPass: false,
    reasonContains: "동의"
  }
}

/**
 * 시나리오 7: FCFS 잔여 0
 */
export const scenario7: TestScenario = {
  id: "S7",
  name: "선착순 마감",
  description: "선착순 모드에서 잔여 수량이 0인 경우",
  setup: () => {
    const settings = createDefaultSettings()
    const company = {
      ...createDefaultCompany(),
      mode: "FCFS" as const,
      remaining: 0 // 마감
    }
    
    return runAllGuards({
      settings,
      userCompanyId: "B01",
      company,
      selectedProducts: ["product-1"],
      selectedLocker: false,
      agreementChecks: {
        personal: true,
        sensitive: true,
        utilization: true
      },
      isWHLVerified: false,
      products: createDefaultProducts()
    })
  },
  expectedResult: {
    canPass: false,
    reasonContains: "마감"
  }
}

/**
 * 시나리오 8: WHL 명단 미확인
 */
export const scenario8: TestScenario = {
  id: "S8",
  name: "추첨 명단 미확인",
  description: "추첨 모드에서 명단 확인이 안된 경우",
  setup: () => {
    const settings = createDefaultSettings()
    const company = {
      ...createDefaultCompany(),
      mode: "WHL" as const
    }
    
    return runAllGuards({
      settings,
      userCompanyId: "B01",
      company,
      selectedProducts: ["product-1"],
      selectedLocker: false,
      agreementChecks: {
        personal: true,
        sensitive: true,
        utilization: true
      },
      isWHLVerified: false, // 명단 미확인
      products: createDefaultProducts()
    })
  },
  expectedResult: {
    canPass: false,
    reasonContains: "명단"
  }
}

/**
 * 모든 시나리오 실행
 */
export const allScenarios = [
  scenario1,
  scenario2,
  scenario3,
  scenario4,
  scenario5,
  scenario6,
  scenario7,
  scenario8
]

/**
 * 시나리오 테스트 실행 함수
 */
export function runScenarioTest(scenario: TestScenario): {
  passed: boolean
  result: any
  expected: any
  error?: string
} {
  try {
    const result = scenario.setup()
    const passed = 
      result.canPass === scenario.expectedResult.canPass &&
      (!scenario.expectedResult.reasonContains || 
       result.reason.includes(scenario.expectedResult.reasonContains))
    
    return {
      passed,
      result,
      expected: scenario.expectedResult,
      error: passed ? undefined : `Expected canPass: ${scenario.expectedResult.canPass}, Got: ${result.canPass}. Expected reason contains: "${scenario.expectedResult.reasonContains}", Got: "${result.reason}"`
    }
  } catch (error) {
    return {
      passed: false,
      result: null,
      expected: scenario.expectedResult,
      error: `Exception: ${error}`
    }
  }
}

/**
 * 모든 시나리오 테스트
 */
export function runAllScenarioTests() {
  return allScenarios.map(scenario => ({
    scenario,
    test: runScenarioTest(scenario)
  }))
}

