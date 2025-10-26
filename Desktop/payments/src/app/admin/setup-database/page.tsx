"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle, Database, Play } from 'lucide-react'

export default function SetupDatabasePage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`])
  }

  const runMigration = async () => {
    setStatus('running')
    setMessage('마이그레이션을 실행 중입니다...')
    setLogs([])
    
    try {
      addLog('agreement_templates 테이블 스키마 업데이트 시작')
      
      const response = await fetch('/api/create-privacy-items-table', {
        method: 'POST',
        credentials: 'include'
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Migration failed')
      }
      
      addLog('✅ 마이그레이션 성공')
      addLog(`추가된 테이블: ${result.tablesCreated?.join(', ') || 'agreement_templates 업데이트'}`)
      
      setStatus('success')
      setMessage('데이터베이스 마이그레이션이 완료되었습니다.')
    } catch (error) {
      console.error('Migration error:', error)
      addLog(`❌ 오류: ${error instanceof Error ? error.message : String(error)}`)
      setStatus('error')
      setMessage(error instanceof Error ? error.message : '마이그레이션 실행 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            데이터베이스 마이그레이션
          </CardTitle>
          <CardDescription>
            agreement_templates 테이블에 category, subcategory, item_type 컬럼을 추가합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={runMigration}
              disabled={status === 'running'}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {status === 'running' ? '실행 중...' : '마이그레이션 실행'}
            </Button>
            
            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">완료</span>
              </div>
            )}
            
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">오류</span>
              </div>
            )}
          </div>

          {message && (
            <div className={`p-4 rounded-md ${
              status === 'success' ? 'bg-green-50 text-green-800' :
              status === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}>
              {message}
            </div>
          )}

          {logs.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">실행 로그</h3>
              <div className="bg-gray-50 p-4 rounded-md space-y-1 max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono text-gray-700">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">실행될 SQL</h3>
            <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-x-auto">
{`-- agreement_templates 테이블 스키마 업데이트
ALTER TABLE agreement_templates 
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) 
  CHECK (item_type IN ('service', 'privacy', 'marketing', 'third_party', 'retention', 'security'));`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
