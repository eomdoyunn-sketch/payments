'use client'

import { useEffect, useState } from 'react'
import { getClientEnvOptional } from '@/env/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestEnvPage() {
  const [envStatus, setEnvStatus] = useState<Record<string, any>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const clientEnv = getClientEnvOptional()
      
      setEnvStatus({
        'NEXT_PUBLIC_SUPABASE_URL': clientEnv.NEXT_PUBLIC_SUPABASE_URL ? '✅ 설정됨' : '❌ 누락',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY': clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 누락',
        'NEXT_PUBLIC_APP_URL': clientEnv.NEXT_PUBLIC_APP_URL,
        'NODE_ENV': process.env.NODE_ENV,
      })
      
      // 실제 값 확인 (보안을 위해 일부만 표시)
      if (clientEnv.NEXT_PUBLIC_SUPABASE_URL) {
        setEnvStatus(prev => ({
          ...prev,
          'URL 미리보기': clientEnv.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...',
        }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
    }
  }, [])

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>환경변수 테스트</CardTitle>
          <CardDescription>
            환경변수가 올바르게 로드되었는지 확인합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
              <strong>오류:</strong> {error}
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="font-semibold">환경변수 상태:</h3>
            {Object.entries(envStatus).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="font-mono text-sm">{key}</span>
                <span className="text-sm">{String(value)}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">확인 사항:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ 모든 환경변수가 "✅ 설정됨"으로 표시되어야 합니다.</li>
              <li>✅ NODE_ENV가 "development"로 표시되어야 합니다.</li>
              <li>❌ "❌ 누락"이 표시되면 .env.local 파일을 확인하세요.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
