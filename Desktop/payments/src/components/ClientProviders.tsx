"use client"

import { SettingsProvider } from "@/contexts/SettingsContext"
import { Toaster } from "@/components/ui/sonner"
import { GlobalErrorHandler } from "@/components/GlobalErrorHandler"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <GlobalErrorHandler />
      {children}
      <Toaster />
    </SettingsProvider>
  )
}
