"use client"

import * as React from "react"
import { createClient } from "@/lib/supabase/client"

export interface ConsentAgreementRecord {
  id: string
  title: string
  content: string
  version: string | null
  enabled: boolean
  required: boolean | null
  updated_at: string | null
}

interface UseConsentAgreementsOptions {
  skip?: boolean
}

export function useConsentAgreements(
  types: string[],
  options: UseConsentAgreementsOptions = {},
) {
  const supabase = React.useMemo(() => createClient(), [])
  const [agreements, setAgreements] = React.useState<Record<string, ConsentAgreementRecord>>({})
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const normalizedTypes = React.useMemo(() => {
    const filtered = types
      .map((type) => type?.trim())
      .filter((type): type is string => Boolean(type && type.length > 0))
    const unique = Array.from(new Set(filtered))
    unique.sort()
    return unique
  }, [types])

  const serializedTypes = React.useMemo(() => JSON.stringify(normalizedTypes), [normalizedTypes])

  const fetchAgreements = React.useCallback(async () => {
    if (options.skip) {
      return
    }

    const typesToFetch = JSON.parse(serializedTypes) as string[]

    if (typesToFetch.length === 0) {
      setAgreements({})
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('🔍 동의서 조회 시작:', { typesToFetch, skip: options.skip })
      
      // agreement_templates 테이블에서 요청된 type의 활성화된 동의서 조회
      const { data, error } = await supabase
        .from("agreement_templates")
        .select("*")
        .in("type", typesToFetch)
        .eq("enabled", true)

      console.log('📊 조회 결과:', { dataCount: data?.length, error })

      if (error) {
        console.error('❌ Supabase 오류:', error)
        throw error
      }

      // type을 key로 사용
      const map: Record<string, ConsentAgreementRecord> = {}
      
      if (data) {
        console.log('📋 데이터 항목:', data.map((item: any) => ({ id: item.id, type: item.type, title: item.title, version: item.version })))
        
        for (const item of data) {
          // type을 key로 사용
          map[item.type] = {
            id: item.id,
            title: item.title,
            content: item.content,
            version: item.version,
            enabled: item.enabled,
            required: item.required,
            updated_at: item.updated_at
          }
        }
      }

      console.log('📦 최종 맵:', Object.keys(map))
      setAgreements(map)
    } catch (err) {
      console.error("❌ 동의서 조회 실패:", err)
      console.error("오류 타입:", typeof err)
      console.error("오류 인스턴스:", err instanceof Error)
      
      if (err && typeof err === 'object') {
        try {
          console.error("오류 상세 (JSON):", JSON.stringify(err, null, 2))
        } catch (e) {
          console.error("JSON 직렬화 실패:", e)
        }
        
        // Supabase PostgrestError인 경우
        if ('message' in err && 'code' in err) {
          console.error("Supabase 오류:", { message: err.message, code: err.code, details: err })
        }
      }
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : "동의서를 불러오지 못했습니다."
        
      console.error("최종 에러 메시지:", errorMessage)
      setError(errorMessage)
      setAgreements({})
    } finally {
      setLoading(false)
    }
  }, [options.skip, serializedTypes, supabase])

  React.useEffect(() => {
    fetchAgreements()
  }, [fetchAgreements])

  return {
    agreements,
    loading,
    error,
    refresh: fetchAgreements,
  }
}
