import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isRefreshTokenError } from '@/lib/auth-utils'
import { validateSupabaseEnv } from '@/lib/env'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  try {
    // 환경변수 검증
    const { url, key } = validateSupabaseEnv()

    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    // 사용자 인증 상태 확인
    let user = null
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        console.warn('미들웨어 인증 확인 오류:', authError.message)
        
        if (isRefreshTokenError(authError)) {
          console.log('미들웨어: Refresh token 오류로 인한 로그아웃 처리')
          user = null
        } else {
          user = authUser
        }
      } else {
        user = authUser
      }
    } catch (error) {
      console.error('미들웨어 예상치 못한 인증 오류:', error)
      user = null
    }

    // 경로별 접근 제어 로직
    const currentPath = request.nextUrl.pathname
    
    console.log(`미들웨어 경로 처리: ${currentPath}, 사용자: ${user ? '인증됨' : '비인증'}`)
    
    // 보호된 경로 정의
    const protectedPaths = ['/admin', '/mypage']
    const publicPaths = ['/login', '/signup', '/', '/components-demo', '/test-scenarios']
    const apiPaths = ['/api']
    const paymentPaths = ['/payment']
    const staticPaths = ['/_next', '/favicon.ico', '/assets']

    const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path))
    const isPublicPath = publicPaths.some(path => currentPath.startsWith(path))
    const isApiPath = apiPaths.some(path => currentPath.startsWith(path))
    const isPaymentPath = paymentPaths.some(path => currentPath.startsWith(path))
    const isStaticPath = staticPaths.some(path => currentPath.startsWith(path))

    // 정적 파일이나 API 경로는 인증 체크 생략
    if (isStaticPath || isApiPath) {
      console.log(`정적/API 경로 접근: ${currentPath}`)
      return supabaseResponse
    }

    // 홈페이지는 항상 접근 가능
    if (currentPath === '/') {
      console.log(`홈페이지 접근: ${currentPath}`)
      return supabaseResponse
    }

    // 비인증 사용자가 보호된 페이지 접근 시 로그인 페이지로 리다이렉트
    if (!user && isProtectedPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirectTo', currentPath)
      console.log(`비인증 사용자 보호된 페이지 접근: ${currentPath} -> /login`)
      return NextResponse.redirect(url)
    }

    // 인증된 사용자가 로그인/회원가입 페이지 접근 시 홈으로 리다이렉트
    if (user && (currentPath === '/login' || currentPath === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      console.log(`인증된 사용자 로그인 페이지 접근: ${currentPath} -> /`)
      return NextResponse.redirect(url)
    }

    // 결제 페이지는 특별 처리 (인증 없이도 접근 가능하지만 로그인 권장)
    if (isPaymentPath && !user) {
      console.log(`비인증 사용자 결제 페이지 접근: ${currentPath}`)
      // 결제 페이지는 인증 없이도 접근 가능하지만, 필요시 로그인 유도 가능
    }

    return supabaseResponse

  } catch (error) {
    console.error('미들웨어 실행 중 오류:', error)
    // 오류 발생 시에도 기본 응답 반환
    return NextResponse.next({ request })
  }
}


