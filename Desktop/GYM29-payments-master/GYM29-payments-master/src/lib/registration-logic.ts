/**
 * GYM29 Registration & Payment Logic
 * 
 * PRD에 따른 계열사별 등록 방식 및 결제창 노출 로직
 */

import { CompanyStatus } from "@/components/common/CompanyStatusTable"

/**
 * 계열사 상태 타입
 * - available: 여유 (70% 미만)
 * - imminent: 임박 (70~99%)
 * - full: 마감 (100% 이상)
 */
export type CompanyRegistrationStatus = "available" | "imminent" | "full"

/**
 * 등록 방식
 * - FCFS: First-Come First-Served (선착순)
 * - WHL: Whitelist (추첨)
 */
export type RegistrationMode = "FCFS" | "WHL"

/**
 * 결제창 표시 가능 여부 판단 결과
 */
export type PaymentEligibility = {
  canPay: boolean
  reason: string
  status: CompanyRegistrationStatus
}

/**
 * 계열사의 현재 등록률을 계산
 * @param registered - 현재 등록 수
 * @param quota - 할당량
 * @returns 등록률 (0~1)
 */
export function calculateRegistrationRate(registered: number, quota: number): number {
  if (quota === 0) return 0
  return Math.min(registered / quota, 1)
}

/**
 * 등록률에 따른 상태 계산
 * @param rate - 등록률 (0~1)
 * @returns 계열사 상태
 */
export function getRegistrationStatus(rate: number): CompanyRegistrationStatus {
  if (rate >= 1.0) return "full"      // 100% 이상: 마감
  if (rate >= 0.7) return "imminent"  // 70~99%: 임박
  return "available"                  // 70% 미만: 여유
}

/**
 * 계열사의 등록 상태를 계산
 * @param company - 계열사 정보
 * @returns 계열사 상태
 */
export function getCompanyRegistrationStatus(company: CompanyStatus): CompanyRegistrationStatus {
  const totalQuota = (company.quota.fullDay || 0) + (company.quota.morning || 0) + (company.quota.evening || 0)
  const totalRegistered = (company.fullDayPaid || 0) + (company.morningPaid || 0) + (company.eveningPaid || 0)
  
  const rate = calculateRegistrationRate(totalRegistered, totalQuota)
  return getRegistrationStatus(rate)
}

/**
 * 선착순 방식에서 결제 가능 여부 확인
 * @param company - 계열사 정보
 * @returns 결제 가능 여부
 */
export function checkFCFSEligibility(company: CompanyStatus): PaymentEligibility {
  const status = getCompanyRegistrationStatus(company)
  
  // 비활성화 상태
  if (company.status !== "active") {
    return {
      canPay: false,
      reason: "등록 기간이 아닙니다",
      status
    }
  }
  
  // 마감 상태
  if (status === "full") {
    return {
      canPay: false,
      reason: "마감되었습니다",
      status
    }
  }
  
  // 여유 또는 임박 상태
  const totalQuota = (company.quota.fullDay || 0) + (company.quota.morning || 0) + (company.quota.evening || 0)
  const totalRegistered = (company.fullDayPaid || 0) + (company.morningPaid || 0) + (company.eveningPaid || 0)
  const remaining = totalQuota - totalRegistered
  
  if (status === "imminent") {
    return {
      canPay: true,
      reason: `잔여 ${remaining}명`,
      status
    }
  }
  
  return {
    canPay: true,
    reason: "결제 가능",
    status
  }
}

/**
 * 추첨 방식에서 결제 가능 여부 확인
 * @param company - 계열사 정보
 * @param isInWhitelist - 사용자가 추첨 명단에 있는지 여부
 * @returns 결제 가능 여부
 */
export function checkWHLEligibility(
  company: CompanyStatus, 
  isInWhitelist: boolean
): PaymentEligibility {
  const status = getCompanyRegistrationStatus(company)
  
  // 비활성화 상태
  if (company.status !== "active") {
    return {
      canPay: false,
      reason: "등록 기간이 아닙니다",
      status
    }
  }
  
  // 명단 불일치
  if (!isInWhitelist) {
    return {
      canPay: false,
      reason: "추첨 대상자만 결제 가능합니다",
      status
    }
  }
  
  // 명단 일치
  return {
    canPay: true,
    reason: "결제 가능",
    status
  }
}

/**
 * 계열사의 결제 가능 여부 확인 (통합)
 * @param company - 계열사 정보
 * @param isInWhitelist - 추첨 명단 포함 여부 (추첨 방식일 때만 사용)
 * @returns 결제 가능 여부
 */
export function checkPaymentEligibility(
  company: CompanyStatus,
  isInWhitelist: boolean = false
): PaymentEligibility {
  if (company.mode === "WHL") {
    return checkWHLEligibility(company, isInWhitelist)
  }
  
  return checkFCFSEligibility(company)
}

/**
 * 상태에 따른 표시 문구 반환
 * @param status - 등록 상태
 * @returns 한글 라벨
 */
export function getStatusLabel(status: CompanyRegistrationStatus): string {
  switch (status) {
    case "available":
      return "여유"
    case "imminent":
      return "임박"
    case "full":
      return "마감"
  }
}

/**
 * 상태에 따른 뱃지 variant 반환
 * @param status - 등록 상태
 * @returns Badge variant
 */
export function getStatusVariant(status: CompanyRegistrationStatus): "default" | "secondary" | "destructive" {
  switch (status) {
    case "available":
      return "default"      // 초록색/파란색
    case "imminent":
      return "secondary"    // 노란색
    case "full":
      return "destructive"  // 빨간색
  }
}


