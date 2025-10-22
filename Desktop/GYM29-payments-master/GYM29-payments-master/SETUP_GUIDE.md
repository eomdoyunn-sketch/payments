# GYM29 Payments - 설정 가이드

## 🚀 Supabase 설정

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com) 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `gym29-payments`
   - Database Password: 안전한 비밀번호 생성
   - Region: `Northeast Asia (Seoul)` 선택
4. "Create new project" 클릭 (약 2분 소요)

### 2. 데이터베이스 스키마 생성
1. 좌측 메뉴에서 **SQL Editor** 클릭
2. **New query** 클릭
3. `supabase-schema.sql` 파일의 전체 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭
5. "Success. No rows returned" 메시지 확인

### 3. API 키 확인
1. 좌측 메뉴에서 **Settings** > **API** 클릭
2. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (긴 문자열)

---

## 💳 토스페이먼츠 설정

### 1. 토스페이먼츠 개발자 계정 생성
1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com) 접속
2. 회원가입 또는 로그인
3. 우측 상단 **내 프로필** 클릭

### 2. 테스트 API 키 발급
1. **개발자센터** > **내 프로필** 클릭
2. **API 키** 탭 선택
3. 다음 정보 복사:
   - **클라이언트 키** (Client Key): `test_ck_...`
   - **시크릿 키** (Secret Key): `test_sk_...`

### 3. 테스트 카드 번호
토스페이먼츠는 다음 테스트 카드 번호를 제공합니다:
- 카드번호: `4000000000001111`
- 유효기간: 미래 날짜 아무거나
- CVC: 아무 3자리

---

## 🔧 환경 변수 설정

### 1. .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 만들고 다음 내용을 입력:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# 토스페이먼츠 설정
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_your_client_key
TOSS_SECRET_KEY=test_sk_your_secret_key

# 애플리케이션 설정
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 2. 실제 값으로 교체
- `your-project-id`: Supabase 프로젝트 ID
- `your-anon-key-here`: Supabase anon key
- `test_ck_your_client_key`: 토스페이먼츠 클라이언트 키
- `test_sk_your_secret_key`: 토스페이먼츠 시크릿 키

---

## ✅ 설정 확인

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. Supabase 연결 확인
1. 브라우저에서 `http://localhost:3001/admin` 접속
2. 콘솔에서 에러 메시지 확인
3. Supabase 대시보드에서 테이블이 생성되었는지 확인

### 3. 결제 테스트
1. `http://localhost:3001` 접속
2. 회원권 선택
3. 동의서 체크
4. "결제하기" 버튼 클릭
5. 테스트 카드 정보 입력
6. 결제 완료 확인

---

## 🔍 문제 해결

### Supabase 연결 오류
```
Error: Invalid Supabase URL
```
**해결**: `.env.local` 파일의 `NEXT_PUBLIC_SUPABASE_URL` 확인

### 토스페이먼츠 로드 실패
```
Error: Invalid client key
```
**해결**: `.env.local` 파일의 `NEXT_PUBLIC_TOSS_CLIENT_KEY` 확인

### 테이블이 없음
```
relation "payments" does not exist
```
**해결**: Supabase SQL Editor에서 `supabase-schema.sql` 재실행

---

## 📚 다음 단계

1. ✅ Supabase & 토스페이먼츠 연동 완료
2. ⏭️ 실제 결제 테스트
3. ⏭️ 로그인/인증 구현
4. ⏭️ 프로덕션 배포

---

## 💡 유용한 링크

- [Supabase 문서](https://supabase.com/docs)
- [토스페이먼츠 문서](https://docs.tosspayments.com)
- [Next.js 문서](https://nextjs.org/docs)

---

**작성일**: 2025-01-11  
**버전**: 1.0.0


