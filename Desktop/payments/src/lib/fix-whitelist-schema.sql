-- whitelists 테이블의 employee_id 컬럼을 nullable로 변경
-- 이 SQL을 Supabase 대시보드의 SQL Editor에서 실행하세요

ALTER TABLE whitelists 
ALTER COLUMN employee_id DROP NOT NULL;

-- 또는 기본값 설정
-- ALTER TABLE whitelists 
-- ALTER COLUMN employee_id SET DEFAULT '';

-- 변경사항 확인
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'whitelists' 
AND column_name = 'employee_id';
