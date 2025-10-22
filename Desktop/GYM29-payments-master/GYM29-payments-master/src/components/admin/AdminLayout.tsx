"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AdminSidebar } from "./AdminSidebar"
import { Menu } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { logout } from "@/app/actions/auth"

type AdminLayoutProps = {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [isHovering, setIsHovering] = React.useState(false)
  const [user, setUser] = React.useState<{
    name: string
    email: string
  } | null>(null)

  const supabase = createClient()

  // 사용자 정보 가져오기
  React.useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          setUser(null)
          return
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('name, email')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setUser({
            name: profile.name,
            email: profile.email
          })
        }
      } catch (error) {
        console.error('사용자 정보 조회 중 오류:', error)
        setUser(null)
      }
    }

    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 호버 감지 영역 (사이드바가 닫혔을 때만) */}
      {!isSidebarOpen && (
        <div
          className="fixed left-0 top-0 z-50 w-4 h-screen"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        />
      )}

      {/* 사이드바 열기 버튼 (호버 시 표시) */}
      {!isSidebarOpen && isHovering && (
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-2 top-20 z-50 shadow-lg"
          onMouseEnter={() => setIsHovering(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300",
          "w-64 border-r bg-card shadow-lg",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <AdminSidebar user={user} onLogout={handleLogout} />
      </aside>

      {/* 메인 컨텐츠 */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "md:pl-64" : "pl-0"
        )}
      >
        {/* 상단바 */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="p-6">{children}</main>
      </div>

      {/* 오버레이 (모바일) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
