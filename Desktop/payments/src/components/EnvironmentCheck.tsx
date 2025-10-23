"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface EnvironmentCheckProps {
  showDetails?: boolean
}

export function EnvironmentCheck({ showDetails = false }: EnvironmentCheckProps) {
  const checks = [
    {
      name: 'Supabase URL',
      value: process.env.NEXT_PUBLIC_SUPABASE_URL,
      required: true,
      description: 'Supabase 프로젝트 URL'
    },
    {
      name: 'Supabase Anon Key',
      value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      required: true,
      description: 'Supabase 익명 키'
    },
    {
      name: 'Toss Client Key',
      value: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
      required: true,
      description: '토스페이먼츠 클라이언트 키'
    },
    {
      name: 'Toss Secret Key',
      value: process.env.TOSS_SECRET_KEY,
      required: true,
      description: '토스페이먼츠 시크릿 키 (서버 전용)',
      isSecret: true
    }
  ]

  const allRequired = checks.filter(check => check.required)
  const configured = allRequired.filter(check => check.value && check.value.trim() !== '')
  const missing = allRequired.filter(check => !check.value || check.value.trim() === '')

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          환경 변수 설정 확인
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {checks.map((check, index) => {
            const isConfigured = check.value && check.value.trim() !== ''
            const Icon = isConfigured ? CheckCircle : XCircle
            const color = isConfigured ? 'text-green-500' : 'text-red-500'
            
            return (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <div>
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-muted-foreground">{check.description}</div>
                    {showDetails && check.value && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {check.isSecret 
                          ? `${check.value.substring(0, 10)}...` 
                          : check.value
                        }
                      </div>
                    )}
                  </div>
                </div>
                <div className={`text-sm ${isConfigured ? 'text-green-600' : 'text-red-600'}`}>
                  {isConfigured ? '설정됨' : '누락'}
                </div>
              </div>
            )
          })}
        </div>

        {missing.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">다음 환경 변수가 설정되지 않았습니다:</p>
                <ul className="list-disc list-inside space-y-1">
                  {missing.map((check, index) => (
                    <li key={index} className="text-sm">
                      <code className="bg-muted px-1 rounded">{check.name}</code>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground">
                  .env.local 파일에 필요한 환경 변수를 설정해주세요.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {configured.length === allRequired.length && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              모든 필수 환경 변수가 올바르게 설정되었습니다.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
