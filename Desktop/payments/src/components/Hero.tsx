"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRightIcon, PlayIcon } from "lucide-react"

// 히어로 컴포넌트 Props 타입 정의
type HeroProps = {
  // 배경 이미지 관련
  backgroundImage?: string
  backgroundImageAlt?: string
  
  // 텍스트 콘텐츠
  title: string
  subtitle?: string
  
  // CTA 버튼 관련
  primaryButtonText?: string
  primaryButtonHref?: string
  primaryButtonOnClick?: () => void
  
  secondaryButtonText?: string
  secondaryButtonHref?: string
  secondaryButtonOnClick?: () => void
  
  // 스타일링 옵션
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  
  // 레이아웃 옵션
  variant?: "default" | "centered" | "left-aligned"
  size?: "sm" | "md" | "lg"
  
  // 오버레이 옵션
  overlay?: boolean
  overlayOpacity?: number
}

export function Hero({
  backgroundImage,
  title,
  subtitle,
  primaryButtonText,
  primaryButtonHref,
  primaryButtonOnClick,
  secondaryButtonText,
  secondaryButtonHref,
  secondaryButtonOnClick,
  className,
  titleClassName,
  subtitleClassName,
  variant = "centered",
  size = "lg",
  overlay = true,
  overlayOpacity = 0.4
}: HeroProps) {
  
  // 배경 이미지 스타일
  const backgroundStyle = backgroundImage 
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }
    : {}

  // 크기별 스타일 설정
  const sizeStyles = {
    sm: "py-16 md:py-20",
    md: "py-20 md:py-28", 
    lg: "py-40 md:py-56 lg:py-72"
  }

  // 제목 크기 스타일
  const titleSizeStyles = {
    sm: "text-3xl md:text-4xl lg:text-5xl",
    md: "text-4xl md:text-5xl lg:text-6xl",
    lg: "text-5xl md:text-6xl lg:text-7xl"
  }

  // 부제목 크기 스타일
  const subtitleSizeStyles = {
    sm: "text-base md:text-lg",
    md: "text-lg md:text-xl",
    lg: "text-xl md:text-2xl"
  }

  // 레이아웃 정렬 스타일
  const alignmentStyles = {
    default: "text-center",
    centered: "text-center",
    "left-aligned": "text-left"
  }

  return (
    <section 
      className={cn(
        "relative w-full overflow-hidden",
        sizeStyles[size],
        alignmentStyles[variant],
        className
      )}
      style={backgroundStyle}
    >
      {/* 오버레이 */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-background/40"
          style={{ 
            opacity: overlayOpacity
          }}
        />
      )}
      
      {/* 콘텐츠 */}
      <div className="relative z-10 container mx-auto px-4">
        <div className={cn(
          "max-w-4xl",
          variant === "left-aligned" ? "mr-auto" : "mx-auto"
        )}>
          {/* 제목 */}
          <h1 
            className={cn(
              "font-bold text-primary-foreground leading-tight mb-6",
              titleSizeStyles[size],
              titleClassName
            )}
          >
            {title}
          </h1>
          
          {/* 부제목 */}
          {subtitle && (
            <p 
              className={cn(
                "text-primary-foreground/90 mb-8 leading-relaxed max-w-2xl",
                subtitleSizeStyles[size],
                variant === "centered" && "mx-auto",
                subtitleClassName
              )}
            >
              {subtitle}
            </p>
          )}
          
          {/* CTA 버튼들 */}
          {(primaryButtonText || secondaryButtonText) && (
            <div className={cn(
              "flex flex-col sm:flex-row gap-4",
              variant === "centered" && "justify-center",
              variant === "left-aligned" && "justify-start"
            )}>
              {/* 주요 CTA 버튼 */}
              {primaryButtonText && (
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 h-auto"
                  onClick={primaryButtonOnClick}
                  {...(primaryButtonHref && { asChild: true })}
                >
                  {primaryButtonHref ? (
                    <a href={primaryButtonHref} className="flex items-center gap-2">
                      {primaryButtonText}
                      <ArrowRightIcon className="w-4 h-4" />
                    </a>
                  ) : (
                    <>
                      {primaryButtonText}
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
              
              {/* 보조 CTA 버튼 */}
              {secondaryButtonText && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-semibold px-8 py-3 h-auto"
                  onClick={secondaryButtonOnClick}
                  {...(secondaryButtonHref && { asChild: true })}
                >
                  {secondaryButtonHref ? (
                    <a href={secondaryButtonHref} className="flex items-center gap-2">
                      <PlayIcon className="w-4 h-4" />
                      {secondaryButtonText}
                    </a>
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4" />
                      {secondaryButtonText}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// 미리 정의된 히어로 스타일 variants
export const HeroVariants = {
  // 기본 히어로
  default: (props: Omit<HeroProps, "variant" | "size">) => (
    <Hero variant="centered" size="lg" {...props} />
  ),
  
  // 작은 히어로
  compact: (props: Omit<HeroProps, "variant" | "size">) => (
    <Hero variant="centered" size="sm" {...props} />
  ),
  
  // 왼쪽 정렬 히어로
  leftAligned: (props: Omit<HeroProps, "variant" | "size">) => (
    <Hero variant="left-aligned" size="lg" {...props} />
  ),
  
  // 큰 히어로
  large: (props: Omit<HeroProps, "variant" | "size">) => (
    <Hero variant="centered" size="lg" {...props} />
  )
}
