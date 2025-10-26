"use client"

import * as React from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { ExcelStyleAgreementManager } from "@/components/admin/ExcelStyleAgreementManager"

export function AgreementManagementClient() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <PageHeader
        title="동의서 관리"
        description="홈페이지에 표시되는 동의서 내용을 관리합니다"
      />
      
      <ExcelStyleAgreementManager />
    </div>
  )
}

