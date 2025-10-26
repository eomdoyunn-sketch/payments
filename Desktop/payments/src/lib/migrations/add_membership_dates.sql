-- 회원권 및 사물함 이용기간 컬럼 추가
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS membership_start_date DATE,
ADD COLUMN IF NOT EXISTS membership_end_date DATE,
ADD COLUMN IF NOT EXISTS locker_start_date DATE,
ADD COLUMN IF NOT EXISTS locker_end_date DATE;

-- 컬럼 추가 완료 메시지
SELECT 'Membership and locker date columns added successfully' as message;
