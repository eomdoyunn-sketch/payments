/**
 * GYM29 Payment Guards
 * 
 * 결제 가능 여부를 판단하는 가드 로직 통합
 */

import { Settings } from "@/contexts/SettingsContext"

type Company = {
  id: string
  name: string
  mode: "FCFS" | "WHL"
  remaining: number
  availableFrom: Date
  availableUntil: Date
  status?: "active" | "inactive"  // 계열사 활성/비활성 상태
}

type GuardResult = {
  canPass: boolean
  reason: string
  type: "error" | "warning" | "success"
}

/**
 * 마스터 결제 토글 확인 (삭제됨)
 * 이제 계열사별 활성 상태만으로 결제를 제어합니다.
 */
export function checkMasterPaymentEnabled(settings: Settings): GuardResult {
  // 마스터 토글 삭제 - 항상 통과
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 계열사 일치 여부 확인
 */
export function checkCompanyMatch(userCompanyId: string, companyId: string): GuardResult {
  if (userCompanyId !== companyId) {
    return {
      canPass: false,
      reason: "등록 예정 명단에서 확인되지 않았습니다. 회사 담당자에게 문의해 주세요.",
      type: "error"
    }
  }
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 계열사 활성 상태 확인
 * 마스터 결제 토글이 ON이어도 계열사가 비활성이면 결제 불가
 */
export function checkCompanyActive(company: Company): GuardResult {
  if (company.status === 'inactive') {
    return {
      canPass: false,
      reason: "해당 계열사는 현재 비활성 상태입니다. 관리자에게 문의해 주세요.",
      type: "error"
    }
  }
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 등록 기간 확인
 * 
 * ⚠️ 현재 등록 기간 제한은 비활성화되어 있습니다.
 * 결제 제어는 계열사별 활성 상태만으로 관리됩니다.
 */
export function checkRegistrationPeriod(company: Company, settings: Settings): GuardResult {
  // 등록 기간 제한 기능 비활성화 - 항상 통과
  // 결제 제어는 계열사별 활성 상태만으로 관리
  return { canPass: true, reason: "", type: "success" }
  
  /* 원래 로직 (비활성화됨)
  const now = new Date()
  
  // 등록 기간 비활성화 시 항상 통과
  if (!settings.registrationPeriod.enabled) {
    return { canPass: true, reason: "", type: "success" }
  }
  
  const availableFrom = company.availableFrom
  const availableUntil = company.availableUntil
  
  if (now < availableFrom) {
    return {
      canPass: false,
      reason: "등록 기간 전에는 결제가 불가합니다.",
      type: "error"
    }
  }
  
  if (now > availableUntil) {
    return {
      canPass: false,
      reason: "등록 기간이 종료되었습니다. 다음 등록 기간에 참여해 주세요.",
      type: "error"
    }
  }
  
  return { canPass: true, reason: "", type: "success" }
  */
}

/**
 * 선착순 모드 마감 확인
 */
export function checkFCFSRemaining(company: Company): GuardResult {
  if (company.mode !== "FCFS") {
    return { canPass: true, reason: "", type: "success" }
  }
  
  if (company.remaining <= 0) {
    return {
      canPass: false,
      reason: "현재 마감되었습니다. 다음 등록 기간에 참여해 주세요.",
      type: "error"
    }
  }
  
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 추첨제 모드 명단 확인
 */
export function checkWHLVerification(company: Company, isVerified: boolean): GuardResult {
  if (company.mode !== "WHL") {
    return { canPass: true, reason: "", type: "success" }
  }
  
  if (!isVerified) {
    return {
      canPass: false,
      reason: "추첨 명단 확인이 필요합니다.",
      type: "error"
    }
  }
  
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 상품 선택 확인
 */
export function checkProductSelected(selectedCount: number): GuardResult {
  if (selectedCount === 0) {
    return {
      canPass: false,
      reason: "상품을 선택해주세요.",
      type: "warning"
    }
  }
  
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 상품 활성 상태 확인
 */
export function checkProductActive(
  productName: string,
  settings: Settings
): GuardResult {
  const productType = productName === "종일권" ? "fullDay" : productName === "오전권" ? "morning" : "evening"
  
  if (!settings.productStatus.memberships[productType]) {
    return {
      canPass: false,
      reason: `${productName}이 현재 비활성화되어 있습니다.`,
      type: "error"
    }
  }
  
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 개인사물함 활성 상태 확인
 */
export function checkLockerActive(selectedLocker: boolean, settings: Settings): GuardResult {
  if (selectedLocker && !settings.productStatus.locker) {
    return {
      canPass: false,
      reason: "개인사물함이 현재 비활성화되어 있습니다.",
      type: "error"
    }
  }
  
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 필수 동의서 확인 - 결제 시에는 동의서 없음 (회원가입 시에만 받음)
 */
export function checkRequiredAgreements(
  agreementChecks: Record<string, boolean>,
  companyId: string,
  settings: Settings
): GuardResult {
  // 결제 시에는 동의서 체크 없음 - 회원가입 시에만 동의서 받음
  return { canPass: true, reason: "", type: "success" }
}

/**
 * 모든 가드를 순차적으로 확인
 * 첫 번째 실패한 가드의 결과를 반환
 */
export function runAllGuards(params: {
  settings: Settings
  userCompanyId: string
  company: Company
  selectedProducts: string[]
  selectedLocker: boolean
  agreementChecks: Record<string, boolean>
  isWHLVerified: boolean
  products: Array<{ id: string; name: string }>
}): GuardResult {
  const {
    settings,
    userCompanyId,
    company,
    selectedProducts,
    selectedLocker,
    agreementChecks,
    isWHLVerified,
    products
  } = params

  // 가드 순서 (우선순위 높은 순)
  const guards = [
    // 마스터 결제 토글 삭제됨 - 계열사별 활성 상태만 사용
    checkCompanyActive(company),                // 1순위: 계열사 활성 상태
    checkCompanyMatch(userCompanyId, company.id),
    checkRegistrationPeriod(company, settings),
    checkFCFSRemaining(company),
    checkWHLVerification(company, isWHLVerified),
    checkProductSelected(selectedProducts.length),
    ...selectedProducts.map(id => {
      const product = products.find(p => p.id === id)
      return product ? checkProductActive(product.name, settings) : { canPass: false, reason: "상품을 찾을 수 없습니다.", type: "error" as const }
    }),
    checkLockerActive(selectedLocker, settings),
    checkRequiredAgreements(agreementChecks, company.id, settings)
  ]

  // 첫 번째 실패한 가드 찾기
  for (const guard of guards) {
    if (!guard.canPass) {
      return guard
    }
  }

  return { canPass: true, reason: "결제 가능", type: "success" }
}

