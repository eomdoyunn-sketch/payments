"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { 
  User, 
  LogIn, 
  LogOut
} from "lucide-react"
import { logout } from "@/app/actions/auth"
import { useRouter } from "next/navigation"

// 헤더 컴포넌트 Props 타입 정의
export type HeaderProps = {
  // 로고/브랜드
  brandName?: string
  brandLogo?: string
  brandHref?: string
  
  // 사용자 정보
  user?: {
    name: string
    email?: string
    companyName?: string // 계열사 이름
    role?: "user" | "admin"
  }
  
  // 로그인/로그아웃 핸들러
  onLogin?: () => void
  onLogout?: () => void
  
  // 스타일링
  className?: string
  variant?: "default" | "transparent" | "sticky"
  
  // 기능 플래그
  showNavigation?: boolean
  showUserMenu?: boolean
}

export function Header({
  brandName = "GYM29",
  brandLogo,
  brandHref = "/",
  user,
  onLogin,
  onLogout,
  className,
  variant = "default",
  showNavigation = true,
  showUserMenu = true,
}: HeaderProps) {
  const router = useRouter()
  
  // 디버깅 로그
  console.log('🎨 Header 컴포넌트 렌더링:', { user, showUserMenu })
  
  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout()
      // logout 액션에서 자동으로 리다이렉트되므로 추가 처리 불필요
    } catch (error) {
      console.error('로그아웃 중 오류:', error)
      // 오류가 발생해도 로그인 페이지로 이동
      router.push('/login')
    }
  }
  
  // 헤더 variant 스타일
  const variantStyles = {
    default: "bg-background border-b",
    transparent: "bg-transparent border-b border-transparent",
    sticky: "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50"
  }
  
  return (
    <header className={cn(variantStyles[variant], className)}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-end">
          {/* 사용자 메뉴 영역 */}
          <div className="flex items-center gap-4">
            {/* 로그인 상태 */}
            {user ? (
              showUserMenu && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-auto rounded-md px-3 py-2 hover:bg-accent">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">{user.name}</span>
                        {user.companyName && (
                          <span className="text-xs text-muted-foreground">{user.companyName}</span>
                        )}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        {user.companyName && (
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.companyName}
                          </p>
                        )}
                        {user.email && (
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/mypage" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        마이페이지
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ) : (
              // 로그아웃 상태
              <Button onClick={() => router.push('/login')} variant="default">
                <LogIn className="mr-2 h-4 w-4" />
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// 미리 정의된 헤더 variants
export const HeaderVariants = {
  // 기본 헤더
  default: (props: Omit<HeaderProps, "variant">) => (
    <Header variant="default" {...props} />
  ),
  
  // 투명 헤더
  transparent: (props: Omit<HeaderProps, "variant">) => (
    <Header variant="transparent" {...props} />
  ),
  
  // 고정 헤더
  sticky: (props: Omit<HeaderProps, "variant">) => (
    <Header variant="sticky" {...props} />
  ),
}

