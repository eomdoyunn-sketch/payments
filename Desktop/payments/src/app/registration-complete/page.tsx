"use client"

import * as React from "react"
import { RegistrationCompleteCard } from "@/components/RegistrationCompleteCard"
import { useRouter } from "next/navigation"

export default function RegistrationCompletePage() {
  const router = useRouter()

  const handleHomeClick = () => {
    router.push('/')
  }

  const handleParqClick = () => {
    // PAR-Q 작성 페이지로 이동 (실제 구현 시 해당 페이지로 라우팅)
    alert('PAR-Q 작성 페이지로 이동합니다.')
    // router.push('/parq')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <RegistrationCompleteCard
        companyName="반트"
        onHomeClick={handleHomeClick}
        onParqClick={handleParqClick}
      />
    </div>
  )
}
