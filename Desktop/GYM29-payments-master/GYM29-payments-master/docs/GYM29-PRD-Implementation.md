# GYM29 Registration & Payment Logic - 구현 가이드

## 📋 개요

본 문서는 GYM29의 회원권 및 개인사물함 상품을 **계열사별 할당 방식**에 따라 등록 및 결제를 관리하는 시스템의 구현 내용을 설명합니다.

---

## 🏗️ 계층 구조

```
상품 (Product)
├── 회원권
│   ├── A계열사 관리
│   │   ├── 배분 회원 수 (할당량)
│   │   ├── 등록 방식: 선착순 or 추첨
│   │   ├── 결제창 노출 조건
│   │   └── 토글: 활성/비활성
│   └── B계열사 관리 ...
└── 개인사물함
    └── ...
```

---

## 🎯 핵심 기능

### 1. 상품 관리 (Product Management)
- 관리자 페이지에서 '회원권', '개인사물함' 상품을 생성 또는 수정 가능
- 상품의 이용기간, 가격, 등록 기간, 결제기간 등은 공통 설정을 따름

**구현 위치**: `src/app/admin/page.tsx` - 전역 설정 섹션

### 2. 계열사 관리 (Affiliate Management)
- 각 상품 내 계열사별 관리 항목

**데이터 구조** (`CompanyStatus` 타입):
```typescript
{
  id: number
  name: string                    // 계열사명
  code: string                    // 계열사 코드
  quota: {                        // 할당량
    fullDay: number
    morning: number
    evening: number
  }
  mode: "FCFS" | "WHL"           // 등록 방식
  status: "active" | "inactive"  // 활성화 상태
  registered: number             // 현재 등록 수
  remaining: number              // 잔여 수
}
```

**구현 위치**: 
- `src/components/common/CompanyStatusTable.tsx` - 계열사 테이블 컴포넌트
- `src/components/admin/CompanyForm.tsx` - 계열사 추가/수정 폼

---

## 📊 등록 방식별 로직

### 선착순 등록 (FCFS - First-Come First-Served)

**정의**: 배분된 `quota` 수만큼 결제가 가능하며, 모두 소진되면 결제 불가

#### 결제창 노출 조건
```typescript
if (is_active === false) {
  show("등록 기간이 아닙니다")
} else if (현재_등록_수 >= quota) {
  show("마감되었습니다")
} else {
  show_payment_ui()
}
```

#### 상태 표시
- **여유**: quota 대비 70% 미만
- **임박**: 70~99% (잔여 인원 표시)
- **마감**: 100% 이상

**구현 위치**: `src/lib/registration-logic.ts` - `checkFCFSEligibility` 함수

---

### 추첨 등록 (WHL - Whitelist)

**정의**: 사전에 업로드된 명단과 로그인 사용자의 계정 정보(사번 + 이름)를 대조하여 결제 자격을 검증

#### 결제창 노출 조건
```typescript
if (is_active === false) {
  show("등록 기간이 아닙니다")
} else if (!user_in_uploaded_list()) {
  show("추첨 대상자만 결제 가능합니다")
} else {
  show_payment_ui()
}
```

#### 명단 업로드
- 엑셀 파일(.xlsx, .xls) 업로드
- 필수 컬럼: `사번`, `이름`
- 선택 컬럼: `이메일`, `연락처`

**구현 위치**: 
- `src/lib/registration-logic.ts` - `checkWHLEligibility` 함수
- `src/components/ExcelUploadModal.tsx` - 명단 업로드 컴포넌트

---

## 🎛️ 관리자 제어 기능

### 통합 관리자 페이지 (`/admin`)

#### 1. 대시보드 통계
- 총 결제 건수
- 총 결제 금액
- 활성 계열사 수
- 등록 현황 (등록 수 / 할당량)

#### 2. 계열사 등록 현황
- 바둑판 형식 테이블
- 계열사별 종일/오전/저녁 배분 및 등록 수
- 실시간 상태 표시 (여유/임박/마감)
- 계열사 추가/수정/삭제

#### 3. 계열사별 등록 방식 관리
- 등록 방식 전환 (선착순 ↔ 추첨)
- 추첨 명단 업로드
- 활성화/비활성화 토글

#### 4. 결제 내역 관리
- 결제 내역 필터링 (계열사, 상태)
- 사물함 번호 입력
- 메모 관리
- 처리 완료 표시
- 엑셀 다운로드

#### 5. 전역 설정
- 상품 가격 설정 (회원권/사물함)
- 등록 기간 설정
- 마스터 결제 토글
- 최대 등록 수 설정

**구현 위치**: `src/app/admin/page.tsx`

---

## 💡 비즈니스 로직 (Business Logic Summary)

### 통합 결제 가능 여부 확인 로직

```typescript
// 선착순 방식
IF is_active == false:
    show("등록 기간이 아닙니다")
ELSE IF registration_type == "선착순":
    IF current_registered >= quota:
        show("마감되었습니다")
    ELSE:
        show_payment_ui()

// 추첨 방식
ELSE IF registration_type == "추첨":
    IF user_in_uploaded_list():
        show_payment_ui()
    ELSE:
        show("대상자만 결제 가능합니다")
```

**구현 함수**: `checkPaymentEligibility` in `src/lib/registration-logic.ts`

---

## 🗂️ 파일 구조

```
src/
├── app/admin/
│   └── page.tsx                        # 통합 관리자 페이지 (메인)
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx             # 관리자 레이아웃
│   │   ├── AdminSidebar.tsx            # 관리자 사이드바
│   │   ├── CompanyForm.tsx             # 계열사 추가/수정 폼
│   │   ├── DataTable.tsx               # 일반 데이터 테이블
│   │   └── PaymentDataTable.tsx        # 결제 내역 테이블
│   ├── common/
│   │   ├── CompanyStatusTable.tsx      # 계열사 상태 테이블
│   │   ├── PageHeader.tsx              # 페이지 헤더
│   │   └── StatusBadge.tsx             # 상태 뱃지
│   ├── ExcelUploadModal.tsx            # 추첨 명단 업로드 모달
│   └── ui/                             # shadcn/ui 컴포넌트들
├── contexts/
│   └── SettingsContext.tsx             # 전역 설정 Context
└── lib/
    ├── registration-logic.ts           # 등록/결제 비즈니스 로직
    └── utils.ts                        # 유틸리티 함수
```

---

## 🚀 주요 API 함수

### `src/lib/registration-logic.ts`

#### 1. `getCompanyRegistrationStatus(company)`
계열사의 현재 등록 상태 계산 (여유/임박/마감)

#### 2. `checkPaymentEligibility(company, isInWhitelist)`
계열사의 결제 가능 여부 확인 (통합)

#### 3. `checkFCFSEligibility(company)`
선착순 방식에서 결제 가능 여부 확인

#### 4. `checkWHLEligibility(company, isInWhitelist)`
추첨 방식에서 결제 가능 여부 확인

#### 5. `getStatusLabel(status)` / `getStatusVariant(status)`
상태에 따른 라벨 및 뱃지 variant 반환

---

## 📦 공통 컴포넌트 재사용

### 통합 페이지에서 사용된 공통 컴포넌트

| 컴포넌트 | 용도 | 위치 |
|---------|------|------|
| `PageHeader` | 페이지 헤더 | `src/components/common/PageHeader.tsx` |
| `Card` 시리즈 | 카드 레이아웃 | `src/components/ui/card.tsx` |
| `CompanyStatusTable` | 계열사 현황 테이블 | `src/components/common/CompanyStatusTable.tsx` |
| `PaymentDataTable` | 결제 내역 테이블 | `src/components/admin/PaymentDataTable.tsx` |
| `CompanyForm` | 계열사 폼 | `src/components/admin/CompanyForm.tsx` |
| `ExcelUploadModal` | 명단 업로드 | `src/components/ExcelUploadModal.tsx` |
| `StatusBadge` | 상태 뱃지 | `src/components/common/StatusBadge.tsx` |

---

## 🔒 버그 방지 및 호환성

### 1. 타입 안전성
- TypeScript를 사용하여 모든 데이터 타입 정의
- `CompanyStatus` 타입을 공통으로 사용하여 일관성 유지

### 2. 상태 관리
- React Context API를 사용한 전역 설정 관리
- localStorage에 자동 저장하여 새로고침 시 데이터 유지

### 3. Hydration 문제 해결
```typescript
const [isClient, setIsClient] = React.useState(false)
React.useEffect(() => {
  setIsClient(true)
}, [])
```

### 4. 에러 처리
- 모든 사용자 액션에 toast 알림 제공
- confirm 다이얼로그로 삭제 등 중요한 액션 확인

---

## 📝 향후 개선 사항

### 1. 데이터베이스 연동
- 현재 메모리 상태 → Supabase 또는 다른 DB로 영구 저장
- 실시간 동기화

### 2. 엑셀 다운로드 기능
- 결제 내역을 엑셀 파일로 다운로드
- 계열사별, 기간별 필터링 옵션

### 3. 사용자 인증
- 관리자 로그인 시스템
- 역할 기반 접근 제어 (RBAC)

### 4. 실시간 알림
- 새로운 결제 발생 시 알림
- 할당량 임박 알림

---

## 🎨 UI/UX 특징

### 1. 단일 페이지 통합
- 모든 관리 기능을 한 페이지에 통합
- 탭 없이 스크롤로 이동
- 섹션별로 명확한 구분

### 2. 실시간 상태 표시
- 대시보드 통계 자동 계산
- 계열사 상태 실시간 업데이트
- 색상으로 상태 구분 (여유/임박/마감)

### 3. 직관적인 인터랙션
- 테이블 행 클릭으로 상세 정보
- 인라인 편집 (사물함 번호, 메모)
- 일괄 처리 기능 (체크박스 선택)

---

## 🛠️ 개발 환경

- **프레임워크**: Next.js 15.5.4 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS v4
- **UI 라이브러리**: shadcn/ui (New York 스타일)
- **상태 관리**: React Context API
- **알림**: Sonner (Toast)
- **엑셀 처리**: xlsx

---

## 📞 문의 및 지원

문제가 발생하거나 질문이 있으시면 개발팀에 문의해주세요.

---

**최종 업데이트**: 2025-10-10  
**버전**: v1.0.0  
**작성자**: GYM29 개발팀


