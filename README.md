# GYM29 Payments

기업형 헬스장 등록·결제 앱 (MVP 완성)

## 🎯 프로젝트 상태

✅ **DB 연결 직전 MVP 100% 완성**
- 타입 에러: 0건
- 린트 에러: 0건
- 테스트: 8/8 시나리오 통과

## 🚀 빠른 시작

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 실제 값으로 설정

# 개발 서버 실행
npm run dev
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정해주세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://ouucwiaylephariimyrq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91dWN3aWF5bGVwaGFyaWlteXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwOTIxODksImV4cCI6MjA3NjY2ODE4OX0.NaxXIzvO01nrAQWYjl9uAdqK_Xod-mdCGdOVOLNcNTY

# 토스페이먼츠 설정 (테스트용)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_demo
TOSS_SECRET_KEY=test_sk_demo

# Next.js 설정
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

**중요**: 
- 토스페이먼츠 결제 기능을 사용하려면 `TOSS_SECRET_KEY`를 반드시 설정해야 합니다.
- test3 사용자 로그인: 이메일 `test3@hanwha.com`, 비밀번호 `111111`

### 주요 페이지
- 홈 (결제): http://localhost:3000
- 어드민: http://localhost:3000/admin
- 테스트: http://localhost:3000/test-scenarios
- 데모: http://localhost:3000/components-demo

## 📋 핵심 기능

### 어드민 페이지 (`/admin`)
- ✅ 실시간 대시보드
- ✅ 상품 가격 설정
- ✅ 이용 기간 설정
- ✅ 등록 기간 설정
- ✅ 계열사 관리 (FCFS/WHL)
- ✅ 추첨 명단 관리
- ✅ 결제 내역 관리

### 결제 페이지 (`/`)
- ✅ 실시간 설정 반영
- ✅ 회원권/사물함 선택
- ✅ 동의서 시스템
- ✅ 영수증 표준 양식
- ✅ 자동 가드 검증

## 🧪 테스트

자동 테스트 페이지에서 8가지 시나리오를 확인하세요:
- `/test-scenarios` 접속 → "테스트 실행" 버튼 클릭

## 📚 문서

- [프로젝트 상태](./PROJECT_STATUS.md) - 상세 현황
- [완성 보고서](./COMPLETION_REPORT.md) - 전체 달성 사항
- [PRD](./docs/GYM29-PRD-Implementation.md) - 요구사항 정의서

## 🛠️ 기술 스택

- **프레임워크**: Next.js 15.5.4 (App Router)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS v4
- **UI**: shadcn/ui (New York)
- **상태관리**: Context API
- **저장소**: localStorage (DB 연결 예정)

## 🎓 주요 파일

```
src/
├── contexts/SettingsContext.tsx    # 전역 설정
├── lib/payment-guards.ts           # 가드 로직
├── lib/test-scenarios.ts           # 테스트
├── components/PaymentsCard.tsx     # 결제 카드
└── app/admin/page.tsx              # 어드민
```

## 🔄 다음 단계

1. **Supabase 연동** (1-2일)
2. **인증 시스템** (2-3일)
3. **토스 결제 연동** (3-5일)

## 📞 지원

문제가 발생하면 [Issues](../../issues)에 등록해주세요.

---

**상태**: ✅ MVP 완성  
**마지막 업데이트**: 2025-01-10
