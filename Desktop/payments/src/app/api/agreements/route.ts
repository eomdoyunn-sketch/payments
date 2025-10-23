import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AGREEMENTS } from '@/lib/agreements'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // 인증 체크
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'templates') {
      // 동의서 템플릿 반환
      return NextResponse.json({
        agreements: AGREEMENTS.map(agreement => ({
          ...agreement,
          lastModified: '2025-01-01'
        }))
      })
    }

    if (type === 'company-settings') {
      // 회사별 설정 반환 (임시 데이터)
      const companySettings = [
        {
          companyId: 'default',
          companyName: '기본 설정',
          agreements: {
            service: { enabled: true, required: true },
            privacy: { enabled: true, required: true },
            marketing: { enabled: false, required: false }
          }
        },
        {
          companyId: 'B01',
          companyName: '삼성전자',
          agreements: {
            service: { enabled: true, required: true },
            privacy: { enabled: true, required: true },
            marketing: { enabled: true, required: true }
          }
        },
        {
          companyId: 'B02',
          companyName: '삼성SDI',
          agreements: {
            service: { enabled: true, required: true },
            privacy: { enabled: true, required: true },
            marketing: { enabled: false, required: false }
          }
        }
      ]

      return NextResponse.json({ companySettings })
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })

  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

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
      case 'saveAgreement':
        // 동의서 저장 로직 (실제 구현 시 데이터베이스에 저장)
        console.log('동의서 저장:', data)
        return NextResponse.json({ success: true })

      case 'saveCompanySettings':
        // 회사별 설정 저장 로직
        console.log('회사별 설정 저장:', data)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

