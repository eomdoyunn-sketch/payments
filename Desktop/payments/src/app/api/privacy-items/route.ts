import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/privacy-items 호출됨')
    
    let supabase
    try {
      supabase = await createClient()
      console.log('Supabase 클라이언트 생성 완료')
    } catch (clientError) {
      console.error('Supabase 클라이언트 생성 실패:', clientError)
      return NextResponse.json({ 
        success: false,
        error: 'Supabase 클라이언트 생성 실패' 
      }, { status: 500 })
    }
    
    // 인증 체크
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('인증 오류:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!user) {
      console.log('인증된 사용자가 없습니다')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log('인증된 사용자:', user.email)

    // 개인정보처리방침 항목 조회
    const { data, error } = await supabase
      .from('privacy_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('개인정보처리방침 조회 오류:', error)
      console.error('오류 상세:', JSON.stringify(error, null, 2))
      return NextResponse.json({ error: '데이터를 불러올 수 없습니다.' }, { status: 500 })
    }

    console.log('데이터 조회 성공:', data?.length || 0, '개 항목')
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API 오류:', error)
    console.error('오류 스택:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/privacy-items 호출됨')
    
    let supabase
    try {
      supabase = await createClient()
      console.log('Supabase 클라이언트 생성 완료')
    } catch (clientError) {
      console.error('Supabase 클라이언트 생성 실패:', clientError)
      return NextResponse.json({ 
        success: false,
        error: 'Supabase 클라이언트 생성 실패' 
      }, { status: 500 })
    }
    
    // 인증 체크
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.error('인증 오류:', authError)
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    if (!user) {
      console.log('인증된 사용자가 없습니다')
      return NextResponse.json({ 
        success: false,
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    console.log('인증된 사용자:', user.email)

    const body = await request.json()
    console.log('API 요청 받음:', { action: body.action, dataId: body.data?.id })
    const { action, data } = body

    switch (action) {
      case 'saveItem':
        console.log('saveItem 실행 시작:', { dataId: data.id, data })
        
        // 데이터 검증
        if (!data.id) {
          console.error('데이터 ID 누락')
          return NextResponse.json({ 
            success: false,
            error: '데이터 ID가 없습니다.' 
          }, { status: 400 })
        }

        // 먼저 기존 항목이 있는지 확인
        const { data: existingData, error: checkError } = await supabase
          .from('privacy_items')
          .select('id')
          .eq('id', data.id)
          .maybeSingle()

        if (checkError) {
          console.error('항목 확인 오류:', checkError)
          console.error('오류 상세:', JSON.stringify(checkError, null, 2))
          return NextResponse.json({ 
            success: false,
            error: `데이터 확인 실패: ${checkError.message}` 
          }, { status: 500 })
        }

        let result
        const updateData = {
          category: data.category,
          subcategory: data.subcategory,
          title: data.title,
          content: data.content,
          required: data.required,
          enabled: data.enabled,
          version: data.version,
          last_modified: data.last_modified,
          item_type: data.item_type
        }

        if (existingData) {
          // 업데이트
          console.log('기존 항목 업데이트:', data.id)
          console.log('업데이트 데이터:', updateData)
          result = await supabase
            .from('privacy_items')
            .update(updateData)
            .eq('id', data.id)
        } else {
          // 새 항목 추가
          console.log('새 항목 추가:', data.id)
          console.log('추가 데이터:', { ...updateData, id: data.id })
          result = await supabase
            .from('privacy_items')
            .insert({
              id: data.id,
              ...updateData
            })
        }

        if (result.error) {
          console.error('항목 저장 오류:', result.error)
          console.error('오류 상세:', JSON.stringify(result.error, null, 2))
          return NextResponse.json({ 
            success: false,
            error: `항목 저장에 실패했습니다: ${result.error.message}` 
          }, { status: 500 })
        }

        console.log('항목 저장 성공:', data.id)
        return NextResponse.json({ success: true })

      case 'deleteItem':
        console.log('deleteItem 실행 시작:', data.id)
        
        // 항목 삭제
        const { error: deleteError } = await supabase
          .from('privacy_items')
          .delete()
          .eq('id', data.id)

        if (deleteError) {
          console.error('항목 삭제 오류:', deleteError)
          console.error('오류 상세:', JSON.stringify(deleteError, null, 2))
          return NextResponse.json({ 
            success: false,
            error: '항목 삭제에 실패했습니다.' 
          }, { status: 500 })
        }

        console.log('항목 삭제 성공:', data.id)
        return NextResponse.json({ success: true })

      default:
        console.error('알 수 없는 액션:', action)
        return NextResponse.json({ 
          success: false,
          error: 'Invalid action' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('API 오류:', error)
    console.error('오류 스택:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
    }, { status: 500 })
  }
}
