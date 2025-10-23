/**
 * localStorage 동기화 유틸리티
 * 어드민과 홈페이지 간 실시간 데이터 동기화를 위한 강제 이벤트 발생
 */

/**
 * localStorage에 데이터를 저장하고 커스텀 이벤트 발생
 * 같은 탭에서도 동기화가 되도록 강제 이벤트 트리거
 */
export function setLocalStorageWithSync(key: string, value: string): void {
  if (typeof window === 'undefined') return
  
  try {
    // localStorage에 저장
    localStorage.setItem(key, value)
    
    // 커스텀 이벤트 발생 (같은 탭 내 동기화용)
    const event = new CustomEvent('localStorageChange', {
      detail: { key, value }
    })
    window.dispatchEvent(event)
    
    // storage 이벤트도 강제 발생 (다른 탭 동기화용)
    const storageEvent = new StorageEvent('storage', {
      key,
      newValue: value,
      oldValue: localStorage.getItem(key),
      storageArea: localStorage,
      url: window.location.href
    })
    window.dispatchEvent(storageEvent)
    
    console.log(`✅ localStorage 동기화: ${key}`)
  } catch (error) {
    console.error(`❌ localStorage 저장 실패: ${key}`, error)
  }
}

/**
 * localStorage 변경 감지 리스너 등록
 * storage 이벤트와 커스텀 이벤트 모두 감지
 */
export function addStorageChangeListener(
  callback: (key: string, value: string | null) => void
): () => void {
  if (typeof window === 'undefined') return () => {}
  
  // storage 이벤트 핸들러 (다른 탭에서 변경 시)
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key) {
      callback(e.key, e.newValue)
    }
  }
  
  // 커스텀 이벤트 핸들러 (같은 탭에서 변경 시)
  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent
    const { key, value } = customEvent.detail
    callback(key, value)
  }
  
  window.addEventListener('storage', handleStorageEvent)
  window.addEventListener('localStorageChange', handleCustomEvent)
  
  // cleanup 함수 반환
  return () => {
    window.removeEventListener('storage', handleStorageEvent)
    window.removeEventListener('localStorageChange', handleCustomEvent)
  }
}

/**
 * 회사 데이터 저장 (동기화 포함)
 */
export function saveCompanies(companies: any[]): void {
  setLocalStorageWithSync('companies', JSON.stringify(companies))
}

/**
 * 회사 데이터 로드
 */
export function loadCompanies(): any[] {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem('companies')
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('❌ 회사 데이터 로드 실패:', error)
    return []
  }
}

