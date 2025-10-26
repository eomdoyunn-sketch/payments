import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { privacySyncManager } from '@/lib/privacy-sync'

// 홈페이지 동기화 API
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 인증 체크
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'syncItem':
        // 개별 항목 동기화
        try {
          const result = await privacySyncManager.syncPrivacyItemToHomepage(data.itemId, data.item)
          return NextResponse.json(result)
        } catch (e: any) {
          console.error('SyncItem failed:', e)
          return NextResponse.json({ success: false, error: e?.message || 'Sync failed' }, { status: 500 })
        }

      case 'regenerateTemplates':
        // 전체 템플릿 재생성
        const regenerateResult = await privacySyncManager.regenerateAllAgreementTemplates()
        return NextResponse.json(regenerateResult)

      case 'checkSyncStatus':
        // 동기화 상태 확인
        const status = await privacySyncManager.checkSyncStatus()
        return NextResponse.json(status)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Privacy sync API error:', error)
    return NextResponse.json({ 
      error: '서버 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}

// 동기화 상태 확인 (GET)
export async function GET() {
  try {
    const status = await privacySyncManager.checkSyncStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error('Sync status check error:', error)
    return NextResponse.json({ 
      error: '동기화 상태 확인에 실패했습니다.',
      details: error.message 
    }, { status: 500 })
  }
}
