# 환경변수 설정 가이드

## 📋 개요

이 프로젝트는 Next.js 15 + Supabase를 사용하는 프로젝트로, 환경변수를 안전하고 타입 안전하게 관리합니다.

## 🔧 설정 완료된 항목

### 1. dotenv-cli 설치 및 설정
- `package.json`에 `dotenv`, `dotenv-cli` 의존성 추가
- `npm run dev` 명령어가 `.env.local`을 자동으로 로드하도록 설정

### 2. 환경변수 타입 정의
- `env.d.ts`: TypeScript 환경변수 타입 정의
- `tsconfig.json`에 `env.d.ts` 포함

### 3. 환경변수 관리 모듈
- `src/env/server.ts`: 서버 전용 환경변수 관리
- `src/env/client.ts`: 클라이언트 전용 환경변수 관리
- `src/env/index.ts`: 통합 환경변수 관리
- `src/lib/env.ts`: 레거시 호환성 유지

### 4. Next.js 설정
- `next.config.ts`에 환경변수 로드 설정 추가

## 📝 사용 방법

### 1. 환경변수 파일 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 애플리케이션 설정
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 환경변수 접근 방법

#### 클라이언트 컴포넌트에서 사용

```typescript
// src/env/client를 사용
import { getClientEnvOptional } from '@/env/client'

export default function MyComponent() {
  const clientEnv = getClientEnvOptional()
  console.log(clientEnv.NEXT_PUBLIC_SUPABASE_URL)
  
  return <div>...</div>
}
```

#### 서버 컴포넌트/Server Actions에서 사용

```typescript
// src/env/server를 사용
import { getServerEnvOptional } from '@/env/server'

export async function myServerAction() {
  const serverEnv = getServerEnvOptional()
  console.log(serverEnv.SUPABASE_SERVICE_ROLE_KEY)
}
```

#### 통합 사용

```typescript
// src/env를 사용
import { env } from '@/env'

// 클라이언트 환경변수
console.log(env.client.NEXT_PUBLIC_SUPABASE_URL)

// 서버 환경변수
console.log(env.server.SUPABASE_SERVICE_ROLE_KEY)

// 검증된 Supabase 설정
const { url, key } = env.supabase()
```

### 3. 개발 서버 실행

```bash
npm run dev
```

이제 `.env.local` 파일이 자동으로 로드됩니다!

### 4. 환경변수 테스트

브라우저에서 다음 URL에 접속하여 환경변수가 올바르게 로드되었는지 확인할 수 있습니다:

```
http://localhost:3000/test-env
```

## 🔍 환경변수 규칙

### NEXT_PUBLIC_ 접두사

- **있음**: 클라이언트 번들에 포함되어 브라우저에서 접근 가능
- **없음**: 서버에서만 접근 가능 (보안)

```typescript
// ✅ 클라이언트에서 접근 가능
process.env.NEXT_PUBLIC_SUPABASE_URL

// ❌ 클라이언트에서 접근 불가 (undefined)
process.env.SUPABASE_SERVICE_ROLE_KEY
```

### 파일 우선순위

1. `.env.local` (최우선, git에 커밋되지 않음)
2. `.env.development.local` 또는 `.env.production.local`
3. `.env.development` 또는 `.env.production`
4. `.env`

## 🛠️ 문제 해결

### 환경변수가 로드되지 않는 경우

1. **`.env.local` 파일이 프로젝트 루트에 있는지 확인**
   ```bash
   ls -la .env.local
   ```

2. **파일 형식 확인**
   ```env
   # 올바른 형식
   VARIABLE_NAME=value
   
   # 잘못된 형식
   VARIABLE_NAME = value  # 공백 주의!
   ```

3. **서버 재시작**
   ```bash
   # Ctrl+C로 서버 종료 후
   npm run dev
   ```

4. **캐시 삭제**
   ```bash
   rm -rf .next
   npm run dev
   ```

### TypeScript 오류가 발생하는 경우

`env.d.ts` 파일이 제대로 인식되는지 확인하세요:

```typescript
// tsconfig.json
{
  "include": [
    "next-env.d.ts",
    "env.d.ts",  // 이 줄이 있는지 확인
    "**/*.ts",
    "**/*.tsx"
  ]
}
```

## 📚 참고 자료

- [Next.js 환경변수 문서](https://nextjs.org/docs/basic-features/environment-variables)
- [dotenv-cli GitHub](https://github.com/entropitor/dotenv-cli)
- [TypeScript 환경변수 타입](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html)

