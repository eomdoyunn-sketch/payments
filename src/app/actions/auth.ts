'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clearAuthTokens } from '@/lib/auth-utils'

// 타입 정의
interface AuthResult {
  error?: string
  success?: boolean
  message?: string
  redirectTo?: string
}

// 로그인 액션
export async function login(formData: FormData): Promise<AuthResult> {
  try {
    // Supabase 클라이언트 생성 시 에러 핸들링
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('Supabase 클라이언트 생성 실패:', clientError)
      
      // 환경 변수 누락 오류인 경우 특별 처리
      if (clientError instanceof Error && clientError.message.includes('환경변수')) {
        return { error: '서버 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.' }
      }
      
      return { error: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 입력 검증
    if (!email || !password) {
      return { error: '이메일과 비밀번호를 입력해주세요.' }
    }

    // @hanwha.com 자동 추가
    const fullEmail = email.includes('@') ? email : `${email}@hanwha.com`

    console.log('로그인 시도:', { email: fullEmail })

    const { data, error } = await supabase.auth.signInWithPassword({
      email: fullEmail,
      password,
    })

    if (error) {
      console.error('로그인 오류:', error.message)
      
      // 이메일 확인 오류인 경우 사용자에게 안내
      if (error.message.includes('Email not confirmed')) {
        return { error: '이메일 확인이 필요합니다. Supabase 대시보드에서 사용자 상태를 확인해주세요.' }
      }
      
      return { error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
    }

    if (!data.user) {
      return { error: '로그인에 실패했습니다.' }
    }

    console.log('로그인 성공:', data.user.email)

    // 사용자 프로필에서 역할 확인
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    revalidatePath('/', 'layout')
    
    // 역할에 따른 리다이렉트 정보 반환
    if (profile?.role === 'admin') {
      console.log('관리자 로그인 - /admin으로 리다이렉트')
      return { 
        success: true, 
        message: '로그인 성공',
        redirectTo: '/admin'
      }
    }
    
    console.log('일반 사용자 로그인 - 홈으로 리다이렉트')
    return { 
      success: true, 
      message: '로그인 성공',
      redirectTo: '/'
    }
    
  } catch (error) {
    console.error('로그인 처리 중 오류:', error)
    
    // 네트워크 오류인 경우 특별 처리
    if (error instanceof Error && error.message.includes('fetch')) {
      return { error: '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.' }
    }
    
    return { error: '로그인 중 오류가 발생했습니다.' }
  }
}

// 회원가입 액션
export async function signup(formData: FormData): Promise<AuthResult> {
  try {
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('Supabase 클라이언트 생성 실패:', clientError)
      
      // 환경 변수 누락 오류인 경우 특별 처리
      if (clientError instanceof Error && clientError.message.includes('환경변수')) {
        return { error: '서버 설정이 완료되지 않았습니다. 관리자에게 문의해주세요.' }
      }
      
      return { error: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.' }
    }
    
    // 폼 데이터 추출
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

    // 성별 변환
    const genderKorean = gender === 'male' ? '남' : gender === 'female' ? '여' : null

    console.log('회원가입 시도:', { email: fullEmail, name, companyCode })

    // 계열사 정보 조회
    const { data: company } = await supabase
      .from('companies')
      .select('name')
      .eq('code', companyCode)
      .single()

    if (!company) {
      return { error: '선택한 계열사 정보를 찾을 수 없습니다.' }
    }

    // Supabase Auth 회원가입 (이메일 확인 비활성화)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: fullEmail,
      password,
      options: {
        emailRedirectTo: undefined, // 이메일 리다이렉트 비활성화
        data: {
          name,
          employee_id: employeeId,
          phone: phone || null,
          gender: genderKorean,
          company_code: companyCode,
          company_name: company.name,
          role: 'user',
          marketing_agreed: marketingAgreed,
        },
      },
    })

    if (authError) {
      console.error('회원가입 오류:', authError.message)
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: '회원가입 중 오류가 발생했습니다.' }
    }

    console.log('회원가입 성공:', authData.user.email)
    revalidatePath('/', 'layout')
    
    return { 
      success: true, 
      message: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.' 
    }
    
  } catch (error) {
    console.error('회원가입 처리 중 오류:', error)
    return { error: '회원가입 중 오류가 발생했습니다.' }
  }
}

// 로그아웃 액션
export async function logout(): Promise<void> {
  try {
    let supabase
    try {
      supabase = await createClient()
    } catch (clientError) {
      console.error('Supabase 클라이언트 생성 실패:', clientError)
      
      // 환경 변수 누락 오류인 경우에도 로그아웃 처리 계속
      if (clientError instanceof Error && clientError.message.includes('환경변수')) {
        console.warn('환경 변수 누락으로 인한 로그아웃 처리')
        clearAuthTokens()
        revalidatePath('/', 'layout')
        redirect('/login')
        return
      }
      
      throw clientError
    }
    
    console.log('로그아웃 시도')
    
    // 클라이언트 사이드 토큰 정리
    clearAuthTokens()
    
    await supabase.auth.signOut()
    console.log('로그아웃 성공')
    
    revalidatePath('/', 'layout')
    redirect('/login')
    
  } catch (error) {
    console.error('로그아웃 중 오류:', error)
    // 오류가 발생해도 로그인 페이지로 리다이렉트
    revalidatePath('/', 'layout')
    redirect('/login')
  }
}

