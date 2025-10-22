"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType = 
  | "active"      // 활성화
  | "inactive"    // 비활성화
  | "completed"   // 완료
  | "pending"     // 대기중
  | "cancelled"   // 취소됨
  | "error"       // 오류

type StatusBadgeProps = {
  status: StatusType
  label?: string
  className?: string
}

const statusConfig = {
  active: {
    label: "활성",
    variant: "default" as const,
    className: "bg-primary hover:bg-primary/90 text-primary-foreground"
  },
  inactive: {
    label: "비활성",
    variant: "outline" as const,
    className: "bg-primary/30 hover:bg-primary/40 text-foreground border-primary/30"
  },
  completed: {
    label: "완료",
    variant: "default" as const,
    className: "bg-primary/80 hover:bg-primary/90 text-primary-foreground"
  },
  pending: {
    label: "대기중",
    variant: "secondary" as const,
    className: "bg-primary/50 hover:bg-primary/60 text-foreground"
  },
  cancelled: {
    label: "취소됨",
    variant: "outline" as const,
    className: "bg-muted hover:bg-muted/80 text-muted-foreground"
  },
  error: {
    label: "오류",
    variant: "destructive" as const,
    className: "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
  }
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const displayLabel = label || config.label

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {displayLabel}
    </Badge>
  )
}
