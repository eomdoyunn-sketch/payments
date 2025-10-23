"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { 
  AlertTriangle, 
  Info, 
  CheckCircle2,
  XCircle
} from "lucide-react"

type NoticeType = "info" | "warning" | "error" | "success"

type NoticeCardProps = {
  type: NoticeType
  title: string
  message: string
  subtitle?: string
  className?: string
}

const noticeConfig = {
  info: {
    icon: Info,
    variant: "default" as const,
    className: "border-primary/50 bg-primary/5 text-foreground",
    iconClassName: "text-primary"
  },
  warning: {
    icon: AlertTriangle,
    variant: "default" as const,
    className: "border-primary/70 bg-primary/10 text-foreground",
    iconClassName: "text-primary/80"
  },
  error: {
    icon: XCircle,
    variant: "destructive" as const,
    className: "border-destructive/50 bg-destructive/5 text-foreground",
    iconClassName: "text-destructive"
  },
  success: {
    icon: CheckCircle2,
    variant: "default" as const,
    className: "border-primary bg-primary/20 text-foreground",
    iconClassName: "text-primary"
  }
}

export function NoticeCard({ 
  type, 
  title, 
  message, 
  subtitle,
  className 
}: NoticeCardProps) {
  const config = noticeConfig[type]
  const Icon = config.icon

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardContent className="py-12">
        <Alert variant={config.variant} className={cn(config.className, "border-2")}>
          <Icon className={cn("h-5 w-5", config.iconClassName)} />
          <AlertTitle className="text-lg font-semibold mb-2">
            {title}
          </AlertTitle>
          <AlertDescription className="text-base">
            {message}
            {subtitle && (
              <div className="mt-2 text-sm opacity-80">
                {subtitle}
              </div>
            )}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
