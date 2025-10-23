-- 동의서 템플릿 테이블
CREATE TABLE IF NOT EXISTS agreement_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL UNIQUE CHECK (type IN ('service', 'privacy', 'marketing')),
  title VARCHAR(200) NOT NULL,
  version VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  required BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 회사별 동의서 설정 테이블
CREATE TABLE IF NOT EXISTS company_agreement_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id VARCHAR(50) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  agreement_type VARCHAR(50) NOT NULL CHECK (agreement_type IN ('service', 'privacy', 'marketing')),
  enabled BOOLEAN DEFAULT FALSE,
  required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, agreement_type)
);

-- 사용자 동의서 동의 내역 테이블
CREATE TABLE IF NOT EXISTS user_agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agreement_type VARCHAR(50) NOT NULL CHECK (agreement_type IN ('service', 'privacy', 'marketing')),
  agreed BOOLEAN DEFAULT FALSE,
  agreed_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, agreement_type)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_company_agreement_settings_company_id ON company_agreement_settings(company_id);
CREATE INDEX IF NOT EXISTS idx_user_agreements_user_id ON user_agreements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_agreements_agreement_type ON user_agreements(agreement_type);

-- 업데이트 시간 자동 갱신 트리거
CREATE TRIGGER update_agreement_templates_updated_at 
    BEFORE UPDATE ON agreement_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_agreement_settings_updated_at 
    BEFORE UPDATE ON company_agreement_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_agreements_updated_at 
    BEFORE UPDATE ON user_agreements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 기본 동의서 템플릿 데이터 삽입
INSERT INTO agreement_templates (type, title, version, content, required, enabled) VALUES
('service', 'GYM29 서비스 이용약관', 'v1.0', 'GYM29 서비스 이용약관 내용...', true, true),
('privacy', '개인정보 수집·이용 동의서', 'v1.3', '개인정보 수집·이용 동의서 내용...', true, true),
('marketing', '마케팅 정보 수집·이용 동의', 'v1.0', '마케팅 정보 수집·이용 동의 내용...', false, true)
ON CONFLICT (type) DO NOTHING;

-- 기본 회사별 설정 데이터 삽입
INSERT INTO company_agreement_settings (company_id, company_name, agreement_type, enabled, required) VALUES
('default', '기본 설정', 'service', true, true),
('default', '기본 설정', 'privacy', true, true),
('default', '기본 설정', 'marketing', false, false),
('B01', '삼성전자', 'service', true, true),
('B01', '삼성전자', 'privacy', true, true),
('B01', '삼성전자', 'marketing', true, true),
('B02', '삼성SDI', 'service', true, true),
('B02', '삼성SDI', 'privacy', true, true),
('B02', '삼성SDI', 'marketing', false, false)
ON CONFLICT (company_id, agreement_type) DO NOTHING;

