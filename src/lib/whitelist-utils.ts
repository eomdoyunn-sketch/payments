/**
 * 추첨제 명단 관리 유틸리티
 * 토스페이먼츠 연동 및 수량 관리를 위한 안전한 매칭 로직
 */

export type WhitelistEntry = {
  id: string
  companyCode: string
  companyName: string
  name: string
  productType: "fullDay" | "morning" | "evening" // 회원권 종류
  createdAt: string
  // employee_id 제거: 계열사 + 이름만으로 검증
}

/**
 * 계열사명 정규화
 * - 공백 제거
 * - 대소문자 통일
 * - 특수문자 제거
 */
export function normalizeCompanyName(companyName: string): string {
  return companyName
    .trim()
    .replace(/\s+/g, '') // 모든 공백 제거
    .replace(/[^\w가-힣]/g, '') // 특수문자 제거 (한글, 영문, 숫자만)
    .toLowerCase()
}

/**
 * 이름 정규화
 * - 공백 제거
 * - 대소문자 통일
 */
export function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, '') // 모든 공백 제거
    .toLowerCase()
}

/**
 * 이름만 입력받는 데이터 파싱 (계열사명은 자동으로 설정)
 * 형식: "이름" (한 줄에 하나씩)
 */
export function parsePastedData(
  text: string, 
  companyCode: string, 
  companyName: string, 
  productType: "fullDay" | "morning" | "evening"
): WhitelistEntry[] {
  const names = text
    .split('\n')
    .map(line => line.trim())
    .filter(name => name.length > 0)
  
  return names.map(name => ({
    id: `${companyCode}-${productType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    companyCode,
    companyName,
    name,
    productType,
    createdAt: new Date().toISOString()
  }))
}

/**
 * 명단에서 사용자 찾기 (회원권별)
 * 계열사코드 + 이름 + 회원권 종류로 매칭 (사번 불필요)
 */
export function findInWhitelist(
  whitelist: WhitelistEntry[],
  companyCode: string,
  userName: string,
  productType: "fullDay" | "morning" | "evening"
): WhitelistEntry | undefined {
  const normalizedUser = normalizeName(userName)

  return whitelist.find(entry => {
    const entryName = normalizeName(entry.name)
    
    return entry.companyCode === companyCode && 
           entryName === normalizedUser &&
           entry.productType === productType
  })
}

/**
 * 사용자가 등록된 모든 회원권 찾기 (계열사코드 + 이름)
 */
export function findAllProductsForUser(
  companyCode: string,
  userName: string
): ("fullDay" | "morning" | "evening")[] {
  const productTypes: ("fullDay" | "morning" | "evening")[] = ["fullDay", "morning", "evening"]
  const availableProducts: ("fullDay" | "morning" | "evening")[] = []

  for (const productType of productTypes) {
    const whitelist = loadWhitelist(companyCode, productType)
    const found = findInWhitelist(whitelist, companyCode, userName, productType)
    if (found) {
      availableProducts.push(productType)
    }
  }

  return availableProducts
}

/**
 * 중복 제거
 */
export function removeDuplicates(entries: WhitelistEntry[]): WhitelistEntry[] {
  const seen = new Set<string>()
  const unique: WhitelistEntry[] = []

  for (const entry of entries) {
    const key = `${normalizeCompanyName(entry.companyName)}-${normalizeName(entry.name)}`
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(entry)
    }
  }

  return unique
}

/**
 * localStorage에 명단 저장 (회원권별)
 */
export function saveWhitelist(
  companyCode: string, 
  productType: "fullDay" | "morning" | "evening",
  entries: WhitelistEntry[]
): void {
  if (typeof window === 'undefined') return
  
  try {
    const key = `gym29-whitelist-${companyCode}-${productType}`
    localStorage.setItem(key, JSON.stringify(entries))
  } catch (error) {
    console.error('명단 저장 실패:', error)
  }
}

/**
 * localStorage에서 명단 불러오기 (회원권별)
 */
export function loadWhitelist(
  companyCode: string,
  productType: "fullDay" | "morning" | "evening"
): WhitelistEntry[] {
  if (typeof window === 'undefined') return []
  
  try {
    const key = `gym29-whitelist-${companyCode}-${productType}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('명단 불러오기 실패:', error)
    return []
  }
}

/**
 * CSV 내보내기용 데이터 변환 (3행 구조)
 */
export function exportToCSV(entries: WhitelistEntry[]): string {
  // 1행: NO, 계열사명, 성명 (헤더)
  const header = 'NO,계열사명,성명\n'
  
  // 2행: 계열사명만 (중복 제거)
  const uniqueCompanies = Array.from(new Set(entries.map(entry => entry.companyName)))
  const companyRow = `,${uniqueCompanies.join(',')},\n`
  
  // 3행부터: 번호, 계열사명, 성명
  const dataRows = entries.map((entry, index) => 
    `${index + 1},${entry.companyName},${entry.name}`
  ).join('\n')
  
  return header + companyRow + dataRows
}

/**
 * 수량 검증 (토스페이먼츠 연동 대비)
 * - 명단 수가 할당량을 초과하지 않는지 확인
 */
export function validateQuantity(
  entries: WhitelistEntry[],
  allocatedTotal: number
): { valid: boolean; message: string } {
  if (entries.length > allocatedTotal) {
    return {
      valid: false,
      message: `명단 인원(${entries.length}명)이 할당량(${allocatedTotal}명)을 초과했습니다.`
    }
  }
  
  return {
    valid: true,
    message: '수량 검증 통과'
  }
}

/**
 * 회원권별 명단 수 계산
 */
export function getWhitelistCounts(companyCode: string): {
  fullDay: number
  morning: number
  evening: number
} {
  return {
    fullDay: loadWhitelist(companyCode, "fullDay").length,
    morning: loadWhitelist(companyCode, "morning").length,
    evening: loadWhitelist(companyCode, "evening").length
  }
}

