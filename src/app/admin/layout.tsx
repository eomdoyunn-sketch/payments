"use client"

import * as React from "react"
import { AdminLayout } from "@/components/admin/AdminLayout"

export default function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}
