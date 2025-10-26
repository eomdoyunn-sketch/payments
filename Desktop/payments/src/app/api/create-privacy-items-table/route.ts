import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    console.log('Running agreement_templates schema update...')
    
    const supabase = await createClient()
    
    // 인증 체크
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // agreement_templates에 컬럼 추가 SQL
    const alterTableSQL = `
      -- agreement_templates 테이블 스키마 업데이트
      ALTER TABLE agreement_templates 
      ADD COLUMN IF NOT EXISTS category VARCHAR(100),
      ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
      ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) 
        CHECK (item_type IN ('service', 'privacy', 'marketing', 'third_party', 'retention', 'security'));
    `

    console.log('SQL to execute:', alterTableSQL)
    
    return NextResponse.json({ 
      success: false,
      error: 'Supabase 대시보드의 SQL Editor에서 아래 SQL을 실행해주세요.',
      sql: alterTableSQL,
      instructions: [
        '1. Supabase 대시보드에 로그인',
        '2. SQL Editor 메뉴 선택',
        '3. 아래 SQL을 복사하여 실행',
        '4. 실행 완료 후 이 페이지를 새로고침'
      ]
    }, { status: 200 })
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}
