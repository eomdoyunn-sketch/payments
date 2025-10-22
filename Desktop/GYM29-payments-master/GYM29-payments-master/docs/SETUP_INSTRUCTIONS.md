# 🚀 Supabase SSR 인증 시스템 설정 가이드

## ✅ 완료된 구현 항목

다음 파일들이 생성 및 업데이트되었습니다:

### 📦 패키지
- ✅ `@supabase/ssr` 설치 완료

### 🔧 Supabase 클라이언트
- ✅ `src/lib/supabase/client.ts` - Browser Client
- ✅ `src/lib/supabase/server.ts` - Server Client  
- ✅ `src/lib/supabase/middleware.ts` - Middleware Client

### 🛡️ Middleware
- ✅ `middleware.ts` - 세션 자동 갱신 및 보호

### ⚡ Server Actions
- ✅ `src/app/actions/auth.ts` - 로그인/회원가입/로그아웃

### 🎨 UI 컴포넌트
- ✅ `src/app/login/page.tsx` - 로그인 페이지
- ✅ `src/app/signup/page.tsx` - 회원가입 페이지
- ✅ `src/app/layout.tsx` - Toaster 이미 포함됨

### 🗄️ 데이터베이스
- ✅ `supabase-auth-schema.sql` - DB 스키마

---

## 🔑 필수 설정 단계

### 1. 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 토스페이먼츠 설정 (기존)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_your_key
TOSS_SECRET_KEY=test_sk_your_key

# 애플리케이션 설정
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Supabase URL과 Key 찾는 방법:
1. [Supabase Dashboard](https://app.supabase.com) 접속
2. 프로젝트 선택
3. **Settings** → **API** 클릭
4. `URL`을 `NEXT_PUBLIC_SUPABASE_URL`에 복사
5. `anon public`을 `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 복사

### 2. Supabase Dashboard 설정

#### 2-1. Email Provider 활성화
1. Supabase Dashboard → **Authentication** → **Providers**
2. **Email** 토글을 **ON**으로 변경
3. **Confirm email** 옵션은 개발 중에는 OFF (프로덕션에서는 ON 권장)

#### 2-2. URL Configuration
1. Authentication → **URL Configuration**
2. **Site URL**: `http://localhost:3000` 입력
3. **Redirect URLs**에 추가:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/**`

### 3. 데이터베이스 스키마 실행

1. Supabase Dashboard → **SQL Editor**
2. **New Query** 클릭
3. `supabase-auth-schema.sql` 파일 내용 복사
4. 붙여넣기 후 **Run** 버튼 클릭
5. 성공 메시지 확인

### 4. 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

---

## 🧪 테스트 방법

### 테스트 1: 회원가입
1. `http://localhost:3000/signup` 접속
2. 정보 입력:
   - 이름: `홍길동`
   - 이메일: `test` (자동으로 `test@hanwha.com`)
   - 사번: `EMP001`
   - 비밀번호: `testpass123`
   - 비밀번호 확인: `testpass123`
   - 약관 동의 체크
3. **회원가입** 버튼 클릭
4. ✅ 성공: `/login`으로 리다이렉트 + 성공 메시지

### 테스트 2: 로그인
1. `http://localhost:3000/login` 접속
2. 정보 입력:
   - 이메일: `test`
   - 비밀번호: `testpass123`
3. **로그인** 버튼 클릭
4. ✅ 성공: `/` (홈)으로 리다이렉트

### 테스트 3: 세션 유지
1. 로그인 후 브라우저 새로고침
2. ✅ 예상: 로그인 상태 유지 (Middleware가 자동 갱신)

### 테스트 4: 보호된 페이지
1. 로그아웃 상태에서 `/admin` 접속
2. ✅ 예상: `/login`으로 자동 리다이렉트

---

## 🔍 문제 해결

### 문제 1: "Invalid API credentials"
**원인**: 환경변수 설정이 잘못됨

**해결**:
1. `.env.local` 파일 확인
2. Supabase Dashboard에서 URL과 Key 다시 복사
3. 개발 서버 재시작 (`npm run dev`)

### 문제 2: "user_profiles 테이블 없음"
**원인**: 데이터베이스 스키마가 실행되지 않음

**해결**:
1. `supabase-auth-schema.sql` 파일 내용 확인
2. Supabase SQL Editor에서 다시 실행

### 문제 3: 회원가입 후 에러
**원인**: RLS 정책이 제대로 설정되지 않음

**해결**:
1. Supabase Dashboard → **Authentication** → **Policies**
2. `user_profiles` 테이블에 3개의 정책이 있는지 확인:
   - Users can view own profile
   - Users can update own profile
   - Anyone can insert their own profile

### 문제 4: 로그인 상태가 유지되지 않음
**원인**: Middleware 설정 문제

**해결**:
1. `middleware.ts` 파일이 프로젝트 루트에 있는지 확인
2. 브라우저 개발자 도구 → Application → Cookies 확인
3. `sb-{project-ref}-auth-token` 쿠키가 있는지 확인

---

## 📊 데이터베이스 확인

### Supabase Dashboard에서 확인:
1. **Table Editor** → `user_profiles` 테이블 선택
2. 회원가입한 사용자 데이터 확인

### SQL로 확인:
```sql
SELECT * FROM public.user_profiles;
```

---

## 🔒 보안 체크리스트

- [ ] `.env.local` 파일이 `.gitignore`에 포함됨
- [ ] RLS(Row Level Security)가 활성화됨
- [ ] 프로덕션에서는 HTTPS 사용
- [ ] 이메일 확인 활성화 (프로덕션)
- [ ] Rate Limiting 설정 (Supabase Dashboard)

---

## 🚀 프로덕션 배포 시

### Vercel 배포
1. Vercel Dashboard → 프로젝트 선택 → **Settings** → **Environment Variables**
2. `.env.local`의 모든 변수 추가
3. `NEXT_PUBLIC_APP_URL`을 실제 도메인으로 변경

### Supabase URL Configuration 업데이트
1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**: `https://yourdomain.com` 입력
3. **Redirect URLs**에 프로덕션 URL 추가

---

## 📚 추가 기능

구현이 필요한 선택적 기능:

### 1. 비밀번호 재설정
- `/forgot-password` 페이지 생성
- `supabase.auth.resetPasswordForEmail()` 사용

### 2. 이메일 확인
- Supabase Dashboard에서 Email Confirmation 활성화
- `/auth/callback/route.ts` 생성

### 3. 사용자 프로필 페이지
- `/profile` 페이지 생성
- `user_profiles` 테이블에서 정보 조회

### 4. 로그아웃 버튼
- Header 컴포넌트에 로그아웃 버튼 추가
- `logout()` Server Action 호출

---

## ✅ 구현 완료!

모든 설정이 완료되면:

1. ✅ 회원가입 가능
2. ✅ 로그인 가능
3. ✅ 세션 자동 갱신
4. ✅ 보호된 페이지 리다이렉트
5. ✅ 안전한 인증 시스템

**문제가 있으면 위의 문제 해결 섹션을 참고하세요!**

---

## 📖 참고 문서

- [Supabase SSR 공식 가이드](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [프로젝트 기획서](./SUPABASE_SSR_AUTH_PLAN.md)


