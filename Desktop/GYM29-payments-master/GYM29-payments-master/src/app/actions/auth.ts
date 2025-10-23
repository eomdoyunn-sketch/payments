'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clearAuthTokens } from '@/lib/auth-utils'

// 로그인 액션
export async function login(formData: FormData) {
  const supabase = await createClient()

  if (!supabase) {
    console.error('❌ Supabase 클라이언트 생성 실패')
    return { error: '인증 서비스에 연결할 수 없습니다.' }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 입력 검증
  if (!email || !password) {
    return { error: '이메일과 비밀번호를 입력해주세요.' }
  }

  // @hanwha.com 자동 추가
  const fullEmail = email.includes('@') ? email : `${email}@hanwha.com`

  const { data, error } = await supabase.auth.signInWithPassword({
    email: fullEmail,
    password,
  })

  if (error) {
    return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }

  // 사용자 프로필에서 role 확인
  if (data.user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    revalidatePath('/', 'layout')
    
    // 관리자는 /admin으로, 일반 사용자는 홈으로 리다이렉트
    if (profile?.role === 'admin') {
      redirect('/admin')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

// 회원가입 액션
export async function signup(formData: FormData) {
  const supabase = await createClient()

  if (!supabase) {
    console.error('❌ Supabase 클라이언트 생성 실패')
    return { error: '인증 서비스에 연결할 수 없습니다.' }
  }

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const employeeId = formData.get('employeeId') as string
  const phone = formData.get('phone') as string
  const gender = formData.get('gender') as string
  const companyCode = formData.get('companyCode') as string
  const password = formData.get('password') as string
  const passwordConfirm = formData.get('passwordConfirm') as string
  const termsAgreed = formData.get('termsAgreed') === 'true'
  const marketingAgreed = formData.get('marketingAgreed') === 'true'

  // 입력 검증
  if (!name || !email || !employeeId || !password || !companyCode) {
    return { error: '모든 필수 항목을 입력해주세요.' }
  }

  if (!termsAgreed) {
    return { error: '이용약관에 동의해주세요.' }
  }

  if (password !== passwordConfirm) {
    return { error: '비밀번호가 일치하지 않습니다.' }
  }

  if (password.length < 6) {
    return { error: '비밀번호는 최소 6자 이상이어야 합니다.' }
  }

  // @hanwha.com 자동 추가
  const fullEmail = email.includes('@') ? email : `${email}@hanwha.com`

  // 성별 값을 데이터베이스 형식으로 변환 (male -> 남, female -> 여)
  const genderKorean = gender === 'male' ? '남' : gender === 'female' ? '여' : null

  // 선택된 계열사 정보 조회
  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('code', companyCode)
    .single()

  const companyName = company?.name || '알 수 없음'

  // Auth 회원가입 - raw_user_meta_data에 모든 정보를 포함시켜 트리거가 자동으로 프로필을 생성
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: fullEmail,
    password,
    options: {
      data: {
        name,
        employee_id: employeeId,
        phone: phone || null,
        gender: genderKorean,
        company_code: companyCode,
        company_name: companyName,
        role: 'user',
        marketing_agreed: marketingAgreed,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: '회원가입 중 오류가 발생했습니다.' }
  }

  console.log('회원가입 성공 - 트리거를 통해 user_profiles 자동 생성됨')
  revalidatePath('/', 'layout')
  
  // 리다이렉트 대신 성공 응답 반환 (클라이언트에서 처리)
  return { success: true, message: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.' }
}

// 로그아웃 액션
export async function logout() {
  try {
    const supabase = await createClient()
    
    // 클라이언트 사이드에서도 로컬 스토리지 정리
    clearAuthTokens()
    
    if (!supabase) {
      console.error('❌ Supabase 클라이언트 생성 실패')
      revalidatePath('/', 'layout')
      redirect('/login')
      return
    }
    
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error) {
    console.error('로그아웃 중 오류:', error)
    // 오류가 발생해도 로그인 페이지로 리다이렉트
    revalidatePath('/', 'layout')
    redirect('/login')
  }
}

