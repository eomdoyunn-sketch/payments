"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Settings,
  Building2,
  CreditCard,
  LogOut,
  User,
  FileText,
  Download,
  BarChart3
} from "lucide-react"

type AdminSidebarProps = {
  className?: string
  user?: {
    name: string
    email: string
  } | null
  onLogout?: () => void
}

const navigationItems = [
  {
    title: "대시보드",
    href: "/admin/dashboard",
    icon: BarChart3,
    description: "실시간 현황 및 통계"
  },
  {
    title: "통합 관리자",
    href: "/admin",
    icon: LayoutDashboard,
    description: "회원권 및 사물함 통합 관리"
  },
  {
    title: "결제내역 관리",
    href: "/admin/payments",
    icon: CreditCard,
    description: "결제 내역 조회 및 관리"
  },
  {
    title: "동의서 관리",
    href: "/admin/agreements",
    icon: FileText,
    description: "동의서 템플릿 및 설정 관리"
  },
  {
    title: "데이터 내보내기",
    href: "/admin/export",
    icon: Download,
    description: "다른 프로그램용 데이터 내보내기"
  }
]

export function AdminSidebar({ className, user, onLogout }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex h-full flex-col bg-muted/40", className)}>
      {/* 로고 및 브랜드 */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">GYM29</h1>
            <p className="text-xs text-muted-foreground">관리자 패널</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* 사용자 정보 및 로그아웃 */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.name || '관리자'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || 'admin@gym29.com'}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          로그아웃
        </Button>
      </div>
    </div>
  )
}
