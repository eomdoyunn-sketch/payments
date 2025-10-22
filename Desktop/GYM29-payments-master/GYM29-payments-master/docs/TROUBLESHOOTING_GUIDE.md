# 🔧 문제 해결 가이드

## 🚨 현재 문제 상황
- ❌ 계열사 선택 드롭다운이 비어있음
- ❌ 회원가입이 Supabase에 저장되지 않음

## 🔍 진단 및 해결 단계

### Step 1: Supabase 데이터베이스 상태 확인

1. **[Supabase Dashboard](https://app.supabase.com)** 접속
2. 프로젝트 선택 (`pgcmozwsjzsbroayfcny`)
3. **SQL Editor** 클릭
4. **New Query** 클릭
5. `debug-setup.sql` 파일 내용 복사 → 붙여넣기 → **Run** 실행

**결과 확인**:
- `companies_exists`: `true`여야 함
- `user_profiles_exists`: `true`여야 함
- `total_companies`: 0보다 커야 함

### Step 2: 계열사 데이터 추가

만약 `companies` 테이블이 없거나 데이터가 없다면:

1. Supabase SQL Editor에서 **New Query** 클릭
2. `setup-companies.sql` 파일 내용 복사 → 붙여넣기 → **Run** 실행

**결과 확인**:
```sql
SELECT code, name, status FROM companies WHERE status = 'active' ORDER BY name;
```

10개의 한화 계열사가 표시되어야 함:
- 한화 에어로스페이스
- 한화 시스템
- 한화 테크윈
- 등등...

### Step 3: user_profiles 테이블 생성

만약 `user_profiles` 테이블이 없다면:

1. Supabase SQL Editor에서 **New Query** 클릭
2. `setup-user-profiles.sql` 파일 내용 복사 → 붙여넣기 → **Run** 실행

### Step 4: Authentication 설정

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Email** 토글을 **ON**으로 변경
3. **Save** 클릭

### Step 5: URL Configuration

1. Authentication → **URL Configuration**
2. **Site URL**: `http://localhost:3000`
3. **Redirect URLs**에 추가:
   ```
   http://localhost:3000/**
   http://localhost:3000/auth/callback
   ```
4. **Save** 클릭

---

## 🧪 테스트 방법

### 1. 개발 서버 재시작
```bash
# 터미널에서 Ctrl+C로 서버 종료 후
npm run dev
```

### 2. 브라우저에서 테스트
1. `http://localhost:3000/signup` 접속
2. 계열사 드롭다운 확인 (10개 계열사가 표시되어야 함)
3. 회원가입 시도:
   - 이름: `홍길동`
   - 계열사: `한화 에어로스페이스` 선택
   - 이메일: `test`
   - 사번: `EMP001`
   - 비밀번호: `testpass123`
   - 비밀번호 확인: `testpass123`
   - 약관 동의 체크
4. **회원가입** 클릭

### 3. 데이터 확인
Supabase SQL Editor에서:
```sql
-- user_profiles 테이블 확인
SELECT name, email, employee_id, company_code, company_name, created_at
FROM public.user_profiles
ORDER BY created_at DESC;
```

---

## 🐛 문제별 해결 방법

### 문제 1: "계열사 목록을 불러오는데 실패했습니다"

**원인**: `companies` 테이블이 없거나 RLS 정책 문제

**해결**:
1. `setup-companies.sql` 실행
2. RLS 정책 확인:
```sql
SELECT * FROM pg_policies WHERE tablename = 'companies';
```

### 문제 2: 회원가입 시 "선택한 계열사 정보를 찾을 수 없습니다"

**원인**: 계열사 코드가 `companies` 테이블에 없음

**해결**:
```sql
-- 계열사 데이터 확인
SELECT code, name, status FROM companies WHERE status = 'active';
```

### 문제 3: user_profiles INSERT 실패

**원인**: 테이블이 없거나 RLS 정책 문제

**해결**:
1. `setup-user-profiles.sql` 실행
2. RLS 정책 확인:
```sql
SELECT * FROM pg_policies WHERE tablename = 'user_profiles';
```

### 문제 4: 브라우저 콘솔 에러

**확인 방법**:
1. F12 → Console 탭
2. 에러 메시지 확인
3. Network 탭에서 API 호출 확인

---

## 📊 예상 결과

### 성공 시:
- ✅ 계열사 드롭다운에 10개 회사 표시
- ✅ 회원가입 성공 → `/login` 리다이렉트
- ✅ `user_profiles` 테이블에 데이터 저장
- ✅ 로그인 성공 → 홈페이지 이동

### 데이터베이스에 저장된 내용:
```sql
-- 예상 결과
name: 홍길동
email: test@hanwha.com
employee_id: EMP001
company_code: HAN001
company_name: 한화 에어로스페이스
marketing_agreed: false
```

---

## 🆘 여전히 문제가 있다면

1. **브라우저 콘솔 에러** 스크린샷
2. **Supabase Dashboard → Logs** 확인
3. **Network 탭**에서 API 응답 확인
4. 위의 진단 SQL 실행 결과 공유

문제를 정확히 파악하여 추가 도움을 드리겠습니다!

