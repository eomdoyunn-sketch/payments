import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration(filename: string) {
  try {
    console.log(`실행 중: ${filename}`)
    
    const migrationPath = join(process.cwd(), 'src/lib/migrations', filename)
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error(`${filename} 실행 실패:`, error)
      return false
    }
    
    console.log(`✅ ${filename} 실행 완료`)
    return true
  } catch (error) {
    console.error(`${filename} 실행 중 오류:`, error)
    return false
  }
}

async function runAllMigrations() {
  console.log('🚀 데이터베이스 마이그레이션 시작...')
  
  const migrations = [
    'create_payments_table.sql',
    'create_agreements_table.sql'
  ]
  
  let successCount = 0
  
  for (const migration of migrations) {
    const success = await runMigration(migration)
    if (success) {
      successCount++
    }
  }
  
  console.log(`\n📊 마이그레이션 완료: ${successCount}/${migrations.length} 성공`)
  
  if (successCount === migrations.length) {
    console.log('🎉 모든 마이그레이션이 성공적으로 완료되었습니다!')
  } else {
    console.log('⚠️ 일부 마이그레이션이 실패했습니다.')
  }
}

// 스크립트가 직접 실행될 때만 마이그레이션 실행
if (require.main === module) {
  runAllMigrations().catch(console.error)
}

export { runAllMigrations }

