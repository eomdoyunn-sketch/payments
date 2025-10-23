-- 환불 관련 컬럼 추가
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS refunded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS refund_date DATE,
ADD COLUMN IF NOT EXISTS refund_reason TEXT,
ADD COLUMN IF NOT EXISTS toss_payment_key TEXT;

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_payments_refunded ON payments(refunded);
CREATE INDEX IF NOT EXISTS idx_payments_toss_payment_key ON payments(toss_payment_key);
