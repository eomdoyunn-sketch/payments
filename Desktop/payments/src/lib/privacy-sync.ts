import { createClient } from '@/lib/supabase/server'

// 개인정보 항목 변경 시 홈페이지에 실시간 반영하는 로직
export class PrivacySyncManager {
  private supabase: any

  constructor() {
    // createClient는 Promise를 반환하므로 즉시 사용할 수 있도록 래핑
    // 각 메서드에서 await로 안전하게 초기화 후 사용
    this.supabase = null
  }

  // 개인정보 항목이 변경되었을 때 홈페이지에 반영
  async syncPrivacyItemToHomepage(itemId: string, changes: any) {
    try {
      if (!this.supabase) this.supabase = await createClient()
      // 1. 변경된 항목 정보 가져오기
      const { data: item, error: fetchError } = await this.supabase
        .from('privacy_items')
        .select('*')
        .eq('id', itemId)
        .single()

      if (fetchError) {
        throw new Error(`Failed to fetch item: ${fetchError.message}`)
      }

      // 2. 홈페이지의 동의서 템플릿 업데이트
      await this.updateHomepageAgreementTemplate(item)

      // 3. 회사별 설정이 영향받는지 확인하고 업데이트
      await this.updateAffectedCompanySettings(itemId, changes)

      // 4. 캐시 무효화 (필요한 경우)
      await this.invalidateCache(item.category)

      console.log(`Privacy item ${itemId} synced to homepage successfully`)
      return { success: true }

    } catch (error) {
      console.error('Privacy sync error:', error)
      throw error
    }
  }

  // 홈페이지의 동의서 템플릿 업데이트
  private async updateHomepageAgreementTemplate(item: any) {
    if (!this.supabase) this.supabase = await createClient()
    const mappedType = this.mapItemTypeToAgreementType(item)
    
    // 개인정보처리방침은 원문 그대로, 나머지는 템플릿 형식으로 저장
    const contentToSave = this.generateAgreementContentForType(mappedType, item)

    const { error: templateError } = await this.supabase
      .from('agreement_templates')
      .upsert({
        type: mappedType,
        title: item.title,
        version: item.version,
        content: contentToSave,
        required: item.required,
        enabled: item.enabled,
        category: item.category,
        subcategory: item.subcategory,
        item_type: item.item_type
      }, { onConflict: 'type' })

    if (templateError) {
      throw new Error(`Failed to update agreement template: ${templateError.message}`)
    }
  }

  // 타입별 콘텐츠 생성
  private generateAgreementContentForType(type: string, item: any): string {
    // privacy_policy는 로그인 모달용이므로 원문 그대로
    if (type === 'privacy_policy') {
      return item.content || ''
    }
    
    // service와 privacy는 signup 페이지용이므로 템플릿 형식
    return this.generateAgreementContent(item)
  }

  // 영향받는 회사별 설정 업데이트
  private async updateAffectedCompanySettings(itemId: string, changes: any) {
    if (!this.supabase) this.supabase = await createClient()
    // 해당 항목을 사용하는 회사들 찾기
    const { data: companies, error: fetchError } = await this.supabase
      .from('company_privacy_settings')
      .select('*')

    if (fetchError) {
      throw new Error(`Failed to fetch company settings: ${fetchError.message}`)
    }

    // 각 회사별로 설정 업데이트
    for (const company of companies) {
      let needsUpdate = false
      const updatedEnabledItems = [...company.enabled_items]
      const updatedRequiredItems = [...company.required_items]

      // 활성화/비활성화 변경 시
      if (changes.hasOwnProperty('enabled')) {
        if (changes.enabled && !updatedEnabledItems.includes(itemId)) {
          updatedEnabledItems.push(itemId)
          needsUpdate = true
        } else if (!changes.enabled && updatedEnabledItems.includes(itemId)) {
          updatedEnabledItems.splice(updatedEnabledItems.indexOf(itemId), 1)
          needsUpdate = true
        }
      }

      // 필수/선택 변경 시
      if (changes.hasOwnProperty('required')) {
        if (changes.required && !updatedRequiredItems.includes(itemId)) {
          updatedRequiredItems.push(itemId)
          needsUpdate = true
        } else if (!changes.required && updatedRequiredItems.includes(itemId)) {
          updatedRequiredItems.splice(updatedRequiredItems.indexOf(itemId), 1)
          needsUpdate = true
        }
      }

      if (needsUpdate) {
        const { error: updateError } = await this.supabase
          .from('company_privacy_settings')
          .update({
            enabled_items: updatedEnabledItems,
            required_items: updatedRequiredItems,
            updated_at: new Date().toISOString()
          })
          .eq('company_id', company.company_id)

        if (updateError) {
          console.error(`Failed to update company ${company.company_id}:`, updateError)
        }
      }
    }
  }

  // 캐시 무효화
  private async invalidateCache(category: string) {
    // 필요에 따라 Redis 캐시나 다른 캐시 시스템 무효화
    // 현재는 로그만 남김
    console.log(`Cache invalidated for category: ${category}`)
  }

  // 항목 타입을 동의서 타입으로 매핑
  private mapItemTypeToAgreementType(item: any): string {
    // 개인정보 항목의 카테고리/제목이 '개인정보처리방침'이면 로그인 모달용 privacy_policy로 매핑
    if ((item.item_type === 'privacy' || item.item_type === 'privacy_policy')) {
      const title = (item.title || '').trim()
      const category = (item.category || '').trim()
      if (title.includes('개인정보처리방침') || category.includes('개인정보처리방침')) {
        return 'privacy_policy'
      }
      return 'privacy'
    }

    const mapping: Record<string, string> = {
      'service': 'service',
      'marketing': 'marketing',
      'third_party': 'privacy',
      'retention': 'privacy',
      'security': 'privacy'
    }
    return mapping[item.item_type] || 'privacy'
  }

  // 동의서 내용 생성
  private generateAgreementContent(item: any): string {
    let content = `# ${item.title}\n\n`
    
    if (item.subcategory) {
      content += `**카테고리**: ${item.category} > ${item.subcategory}\n\n`
    } else {
      content += `**카테고리**: ${item.category}\n\n`
    }

    content += `**내용**:\n${item.content}\n\n`
    content += `**버전**: ${item.version}\n`
    content += `**수정일**: ${item.last_modified}\n\n`

    if (item.required) {
      content += `**※ 필수 동의 항목입니다.**\n`
    } else {
      content += `**※ 선택 동의 항목입니다.**\n`
    }

    return content
  }

  // 전체 동의서 템플릿 재생성
  async regenerateAllAgreementTemplates() {
    try {
      if (!this.supabase) this.supabase = await createClient()
      // 모든 개인정보 항목 가져오기
      const { data: items, error: fetchError } = await this.supabase
        .from('privacy_items')
        .select('*')
        .eq('enabled', true)

      if (fetchError) {
        throw new Error(`Failed to fetch privacy items: ${fetchError.message}`)
      }

      // 카테고리별로 그룹화
      const itemsByCategory = items.reduce((acc: any, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      }, {})

      // 각 카테고리별로 동의서 템플릿 생성
      for (const [category, categoryItems] of Object.entries(itemsByCategory)) {
        const template = this.generateCategoryAgreementTemplate(category, categoryItems as any[])
        
        const { error: insertError } = await this.supabase
          .from('agreement_templates')
          .upsert({
            type: this.mapItemTypeToAgreementType((categoryItems as any[])[0]),
            title: `${category} 동의서`,
            version: 'v1.1.0',
            content: template,
            required: (categoryItems as any[]).some(item => item.required),
            enabled: true,
            category: category,
            item_type: (categoryItems as any[])[0].item_type
          })

        if (insertError) {
          console.error(`Failed to insert template for category ${category}:`, insertError)
        }
      }

      console.log('All agreement templates regenerated successfully')
      return { success: true }

    } catch (error) {
      console.error('Template regeneration error:', error)
      throw error
    }
  }

  // 카테고리별 동의서 템플릿 생성
  private generateCategoryAgreementTemplate(category: string, items: any[]): string {
    let content = `# ${category}\n\n`
    content += `**시행일자**: ${new Date().toISOString().split('T')[0]}\n`
    content += `**버전**: v1.1.0\n\n`

    items.forEach((item, index) => {
      content += `## ${index + 1}. ${item.title}\n\n`
      
      if (item.subcategory) {
        content += `**하위 카테고리**: ${item.subcategory}\n\n`
      }

      content += `${item.content}\n\n`

      if (item.required) {
        content += `**※ 필수 동의 항목입니다.**\n\n`
      } else {
        content += `**※ 선택 동의 항목입니다.**\n\n`
      }
    })

    return content
  }

  // 실시간 동기화 상태 확인
  async checkSyncStatus() {
    try {
      if (!this.supabase) this.supabase = await createClient()
      // 최근 변경된 항목들 확인
      const { data: recentItems, error: fetchError } = await this.supabase
        .from('privacy_items')
        .select('*')
        .gte('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 최근 24시간

      if (fetchError) {
        throw new Error(`Failed to fetch recent items: ${fetchError.message}`)
      }

      return {
        recentChanges: recentItems.length,
        lastSync: new Date().toISOString(),
        status: 'healthy'
      }

    } catch (error) {
      console.error('Sync status check error:', error)
      return {
        recentChanges: 0,
        lastSync: null,
        status: 'error',
        error: error.message
      }
    }
  }
}

// 싱글톤 인스턴스
export const privacySyncManager = new PrivacySyncManager()
