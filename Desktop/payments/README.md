# GYM29 Payments System

GYM29 헬스장 결제 및 동의서 관리 시스템

## 🚀 주요 기능

### 💳 결제 관리
- **결제내역 조회**: 모든 결제 데이터를 한눈에 확인
- **실시간 편집**: 사물함 번호, 메모, 처리상태 실시간 업데이트
- **고급 필터링**: 회사, 결제상태, 처리상태별 검색
- **통계 대시보드**: 총 결제 건수, 금액, 완료/미처리 현황

### 📋 동의서 관리
- **동의서 템플릿**: 서비스, 개인정보, 마케팅 동의서 관리
- **회사별 설정**: 각 회사마다 다른 동의서 정책 적용
- **실시간 편집**: 동의서 내용 수정 및 버전 관리
- **미리보기 기능**: 동의서 내용 확인 및 검토

### 📊 데이터 내보내기
- **다양한 형식**: Excel, CSV, JSON 형식 지원
- **선택적 내보내기**: 원하는 데이터만 선택하여 내보내기
- **필터링**: 날짜, 회사, 상태별 필터링 지원
- **다른 프로그램 연동**: 외부 시스템과의 데이터 연동

### 👤 회원가입 시스템
- **SHP 구조 적용**: 3단계 동의서 구조 (서비스, 개인정보, 마케팅)
- **모달 기반 약관**: 각 동의서 내용을 상세히 확인 가능
- **필수/선택 구분**: 시각적으로 명확한 구분
- **회원가입 시점 수집**: 법적 안정성을 위한 회원가입 시 동의서 처리

## 🛠 기술 스택

- **Frontend**: Next.js 15.5.4, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **Payment**: 토스페이먼츠
- **Icons**: Lucide React

## 📦 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```env
# Supabase Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 데이터베이스 설정
```bash
# 마이그레이션 실행
npm run migrate

# 테스트 데이터 생성
npm run seed

# 또는 한번에 실행
npm run db:setup
```

### 4. 개발 서버 실행
```bash
npm run dev
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── admin/                 # 관리자 페이지
│   │   ├── payments/         # 결제내역 관리
│   │   ├── agreements/       # 동의서 관리
│   │   └── export/          # 데이터 내보내기
│   ├── api/                 # API 엔드포인트
│   │   ├── payments/        # 결제 API
│   │   ├── agreements/      # 동의서 API
│   │   └── export/          # 내보내기 API
│   ├── signup/              # 회원가입 페이지
│   └── login/               # 로그인 페이지
├── components/
│   ├── admin/               # 관리자 컴포넌트
│   ├── common/              # 공통 컴포넌트
│   └── ui/                  # shadcn/ui 컴포넌트
├── lib/
│   ├── migrations/          # 데이터베이스 마이그레이션
│   ├── supabase/           # Supabase 설정
│   └── agreements.ts       # 동의서 데이터
└── hooks/                  # 커스텀 훅
```

## 🗄 데이터베이스 스키마

### payments 테이블
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  payment_date DATE NOT NULL,
  company VARCHAR(100) NOT NULL,
  employee_id VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  membership_type VARCHAR(100) NOT NULL,
  membership_period INTEGER NOT NULL,
  has_locker BOOLEAN DEFAULT FALSE,
  locker_period INTEGER DEFAULT 0,
  locker_number VARCHAR(20),
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  processed BOOLEAN DEFAULT FALSE,
  memo TEXT,
  toss_payment_key VARCHAR(100),
  toss_order_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### agreement_templates 테이블
```sql
CREATE TABLE agreement_templates (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  version VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  required BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 배포

### 1. 빌드
```bash
npm run build
```

### 2. 프로덕션 실행
```bash
npm run start
```

## 📝 사용법

### 관리자 페이지 접근
1. `/admin` 경로로 접근
2. 로그인 후 사이드바에서 원하는 기능 선택
3. 결제내역, 동의서 관리, 데이터 내보내기 기능 이용

### 회원가입
1. `/signup` 경로로 접근
2. 필수 정보 입력
3. 동의서 확인 및 동의
4. 회원가입 완료

### 데이터 내보내기
1. 관리자 페이지에서 "데이터 내보내기" 탭 선택
2. 내보낼 데이터 타입 선택
3. 필터 설정 (선택사항)
4. 파일 형식 선택 (Excel, CSV, JSON)
5. 내보내기 실행

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm run start

# 린트 검사
npm run lint

# 데이터베이스 마이그레이션
npm run migrate

# 테스트 데이터 생성
npm run seed

# 데이터베이스 전체 설정
npm run db:setup
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해 주세요.

---

**GYM29 Payments System** - 전문적인 헬스장 결제 및 동의서 관리 솔루션