import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 시작 날짜에서 개월을 더한 종료 날짜를 계산합니다
 */
export function calculateEndDate(startDate: string, months: number): string {
  // 입력값 검증
  if (!startDate || typeof startDate !== 'string') {
    console.warn('Invalid startDate:', startDate)
    return '2025-01-01' // 기본값 반환
  }
  
  // months가 undefined이거나 null인 경우 기본값 3 사용
  const validMonths = (typeof months === 'number' && months >= 0) ? months : 3
  
  if (validMonths !== months) {
    console.warn('Invalid months provided, using default (3):', months)
  }

  try {
    const start = new Date(startDate)
    
    // 유효하지 않은 날짜인지 확인
    if (isNaN(start.getTime())) {
      console.warn('Invalid date string:', startDate)
      return '2025-01-01' // 기본값 반환
    }
    
    const end = new Date(start)
    end.setMonth(start.getMonth() + validMonths)
    
    // 마지막 날로 조정 (예: 1월 31일 + 1개월 = 2월 28일/29일)
    end.setDate(end.getDate() - 1)
    
    // 결과 날짜가 유효한지 확인
    if (isNaN(end.getTime())) {
      console.warn('Invalid calculated end date')
      return startDate // 시작 날짜 반환
    }
    
    return end.toISOString().split('T')[0]
  } catch (error) {
    console.error('Error calculating end date:', error)
    return startDate // 에러 시 시작 날짜 반환
  }
}

/**
 * 날짜를 YYYY.M.D 형식으로 포맷팅합니다
 */
export function formatDateForDisplay(dateString: string): string {
  // 입력값 검증
  if (!dateString || typeof dateString !== 'string') {
    console.warn('Invalid dateString:', dateString)
    return '2025.1.1' // 기본값 반환
  }

  try {
    const date = new Date(dateString)
    
    // 유효하지 않은 날짜인지 확인
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString)
      return '2025.1.1' // 기본값 반환
    }
    
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    
    return `${year}.${month}.${day}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return '2025.1.1' // 에러 시 기본값 반환
  }
}
