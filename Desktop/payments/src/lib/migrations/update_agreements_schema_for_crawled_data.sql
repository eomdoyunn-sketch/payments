-- 크롤링된 SHP 개인정보처리방침 데이터에 맞춰 동의서 스키마 업데이트

-- 기존 테이블 수정
ALTER TABLE agreement_templates 
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
ADD COLUMN IF NOT EXISTS item_type VARCHAR(50) CHECK (item_type IN ('service', 'privacy', 'marketing', 'third_party', 'retention', 'security'));

-- 크롤링된 데이터를 저장할 새로운 테이블 생성
CREATE TABLE IF NOT EXISTS privacy_items (
  id VARCHAR(100) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  required BOOLEAN DEFAULT FALSE,
  enabled BOOLEAN DEFAULT TRUE,
  version VARCHAR(20) NOT NULL,
  last_modified DATE DEFAULT CURRENT_DATE,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('service', 'privacy', 'marketing', 'third_party', 'retention', 'security')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 회사별 설정을 더 유연하게 관리할 수 있는 테이블
CREATE TABLE IF NOT EXISTS company_privacy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id VARCHAR(50) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  enabled_items TEXT[], -- JSON 배열로 저장
  required_items TEXT[], -- JSON 배열로 저장
  custom_settings JSONB, -- 추가 설정을 JSON으로 저장
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_privacy_items_category ON privacy_items(category);
CREATE INDEX IF NOT EXISTS idx_privacy_items_type ON privacy_items(item_type);
CREATE INDEX IF NOT EXISTS idx_privacy_items_enabled ON privacy_items(enabled);
CREATE INDEX IF NOT EXISTS idx_company_privacy_settings_company_id ON company_privacy_settings(company_id);

-- 트리거 생성
CREATE TRIGGER update_privacy_items_updated_at 
    BEFORE UPDATE ON privacy_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_privacy_settings_updated_at 
    BEFORE UPDATE ON company_privacy_settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 크롤링된 SHP 개인정보처리방침 데이터 삽입
INSERT INTO privacy_items (id, category, subcategory, title, content, required, enabled, version, item_type) VALUES
-- 개인정보 수집 및 이용목적
('collection-purpose-1', '개인정보 수집 및 이용목적', NULL, '회원관리', '서비스 이용에 따른 본인 확인, 개인식별, 불량회원의 부정이용 방지와 비인가 사용 방지, 미성년자의 확인, 회원상담, 회원불만 접수 및 처리, 분쟁조정을 위한 기록보존, 고지사항 전달', true, true, 'v1.1.0', 'privacy'),
('collection-purpose-2', '개인정보 수집 및 이용목적', NULL, '서비스 제공에 관한 계약의 이행 및 서비스 제공에 따른 요금정산', '서비스 및 부가 서비스 이용에 대한 요금 결제, 콘텐츠 제공, 이벤트/경품당첨 결과안내 및 상품배송, 금융거래 관련 본인인증 및 금융서비스, 강습계약서 발송, 구매 및 요금결제, 환불', true, true, 'v1.1.0', 'service'),
('collection-purpose-3', '개인정보 수집 및 이용목적', NULL, '마케팅 및 광고에 활용', '새로운 서비스 및 신상품이나 이벤트 정보 등의 안내, 회원에게 최적화된 서비스 제공, 개인맞춤 서비스를 제공하기 위한 자료, 마케팅 활용, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재', false, true, 'v1.1.0', 'marketing'),
('collection-purpose-4', '개인정보 수집 및 이용목적', NULL, '온라인 프로그램에 활용', '회원에게 최적화 온라인 프로그램 서비스 제공, 서비스 품질 유지·관리 및 개선에 활용, 회원의 건강 정보를 바탕으로 맞춤형 건강 증진 서비스 및 건강정보 제공', false, true, 'v1.1.0', 'service'),

-- 개인정보의 수집항목
('collection-items-1', '개인정보의 수집항목', '필수정보', '통합/준/정회원(온라인, CFC)', '아이디, 비밀번호, 성명, 생년월일, 휴대폰번호, 성별, 국적, 회사명, 닉네임, 주소(자택), 사원번호, 이메일주소', true, true, 'v1.1.0', 'privacy'),
('collection-items-2', '개인정보의 수집항목', '고유식별 정보', '고유식별정보', '주민등록번호, CI, DI', true, true, 'v1.1.0', 'privacy'),
('collection-items-3', '개인정보의 수집항목', '선택정보', '피트니스 시설 이용 정보', '계좌번호(환불요청 시), 은행명(환불 요청 시), 예금주명(환불 요청 시), 차량정보, 직전 이용클럽, 반트를 알게 된 경로, 성명(영문), 회사명, 회사주소, 직급, 차량번호, 결혼기념일, 생년월일, 국적, 전화번호, 업종명, 업체명, 홈페이지 주소, 가입경로, 성별(SNS), 이메일(SNS)', false, true, 'v1.1.0', 'privacy'),
('collection-items-4', '개인정보의 수집항목', '민감 정보', '건강정보', '건강정보(운동 전 신체 준비 상태 설문지, Pra-q), 병력(수술여부, 심장질환, 당뇨, 혈압, 고지혈증, 기타), 건강검진결과(65세 이상의 경우, Par-q "예" 1항목 이상), 임신 주수 및 상태(의사소견서)', true, true, 'v1.1.0', 'privacy'),

-- 개인정보 공유 및 제3자 제공
('third-party-1', '개인정보 공유 및 제3자 제공', NULL, '인바디', '신체정보 측정을 위한 회원정보 제공 - 회원번호, 성명, 성별, 나이, 키, 휴대폰번호, 사번, SHP밴드번호', false, true, 'v1.1.0', 'third_party'),
('third-party-2', '개인정보 공유 및 제3자 제공', NULL, '대양CSI', '회원 출입을 위한 회원정보 제공 - 회원번호, 성명, 성별, 나이, 키, 휴대폰번호, 사번, SHP밴드번호', false, true, 'v1.1.0', 'third_party'),
('third-party-3', '개인정보 공유 및 제3자 제공', NULL, '모두싸인', '강습 계약을 위한 정보 제공 - 이름, 생년월일, 주소, 연락처', false, true, 'v1.1.0', 'third_party'),
('third-party-4', '개인정보 공유 및 제3자 제공', NULL, '삼성전자, 삼성 E&A, 삼성 SDI', '근태시스템(삼성 전자, E&A, SDI) 출입정보 연동을 위한 정보 제공 - 회원번호, 사번', false, true, 'v1.1.0', 'third_party'),
('third-party-5', '개인정보 공유 및 제3자 제공', NULL, '호텔신라', 'SHP 사내 시스템 연동을 위한 회원정보 제공 - 주민등록번호, 외국인등록번호, 사업자등록번호, 법인등록번호, 회원명(한글), 회원명(영문), 성별, 국적, 우편번호, 핸드폰번호, 이메일, 생년월일, 회원번호', false, true, 'v1.1.0', 'third_party'),

-- 개인정보처리업무의 위탁
('consignment-1', '개인정보처리업무의 위탁', NULL, '메가존', '전산시스템 유지보수 및 개발', false, true, 'v1.1.0', 'third_party'),
('consignment-2', '개인정보처리업무의 위탁', NULL, '스카우트', '회원 상담 및 응대', false, true, 'v1.1.0', 'third_party'),
('consignment-3', '개인정보처리업무의 위탁', NULL, 'NICE평가정보', '본인인증을 위한 핸드폰 인증 및 아이핀 인증 대행', false, true, 'v1.1.0', 'third_party'),
('consignment-4', '개인정보처리업무의 위탁', NULL, '한국정보통신', '신용카드, 신라페이 간편결제, 휴대폰, 계좌이체, 무통장입금을 통한 결제처리', false, true, 'v1.1.0', 'third_party'),

-- 개인정보 보유 및 이용기간
('retention-1', '개인정보 보유 및 이용기간', NULL, '계약 또는 청약철회 등에 관한 기록', '전자상거래 등에서의 소비자 보호에 관한 법률 - 5년', true, true, 'v1.1.0', 'retention'),
('retention-2', '개인정보 보유 및 이용기간', NULL, '대금결제 및 재화 등의 공급에 관한 기록', '5년', true, true, 'v1.1.0', 'retention'),
('retention-3', '개인정보 보유 및 이용기간', NULL, '소비자의 불만 또는 분쟁처리에 관한 기록', '3년', true, true, 'v1.1.0', 'retention'),

-- 개인정보의 안전성 확보 조치
('security-1', '개인정보의 안전성 확보 조치', NULL, '개인정보 취급 직원의 최소화 및 교육', '개인정보취급자의 지정을 최소화하고 취급자 별로 사용자 계정을 발급하며, 정기적인 교육을 시행하고 있습니다.', true, true, 'v1.1.0', 'security'),
('security-2', '개인정보의 안전성 확보 조치', NULL, '개인정보의 암호화', '이용자의 개인정보는 비밀번호는 암호화 되어 저장 및 관리되고 있어, 본인만이 알 수 있으며 파일 및 전송 데이터를 암호화 및 중요한 데이터는 별도의 보안 기능을 통해 보호되고 있습니다.', true, true, 'v1.1.0', 'security'),
('security-3', '개인정보의 안전성 확보 조치', NULL, '해킹 등에 대비한 기술적 대책', '해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위하여 보안프로그램을 설치하고 주기적인 갱신·점검을 하며 외부로부터 접근이 통제된 구역에 시스템을 설치하고 기술적/물리적으로 감시 및 차단하고 있습니다.', true, true, 'v1.1.0', 'security'),

-- 개인정보보호책임자
('privacy-officer-1', '개인정보보호책임자', NULL, '개인정보보호책임자', '김회선 - 경영지원그룹 CPO - 02-2028-1501 - hoesun.kim@samsung.com', true, true, 'v1.1.0', 'privacy'),
('privacy-officer-2', '개인정보보호책임자', NULL, '개인정보보호관리자', '윤영준 - CFC사업그룹 그룹장 - 02-2028-1501 - Duhwan.yang@samsung.com', true, true, 'v1.1.0', 'privacy'),
('privacy-officer-3', '개인정보보호책임자', NULL, '개인정보보호담당자', '전용남 - IT 개발 파트 프로 - 02-2028-1501 - yongnam86.jeon@samsung.com', true, true, 'v1.1.0', 'privacy')

ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  subcategory = EXCLUDED.subcategory,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  required = EXCLUDED.required,
  enabled = EXCLUDED.enabled,
  version = EXCLUDED.version,
  item_type = EXCLUDED.item_type,
  last_modified = EXCLUDED.last_modified,
  updated_at = NOW();

-- 회사별 설정 데이터 삽입
INSERT INTO company_privacy_settings (company_id, company_name, enabled_items, required_items, custom_settings) VALUES
('default', '기본 설정', 
 ARRAY['collection-purpose-1', 'collection-purpose-2', 'collection-items-1', 'collection-items-2', 'retention-1', 'retention-2', 'security-1', 'security-2', 'privacy-officer-1'],
 ARRAY['collection-purpose-1', 'collection-purpose-2', 'collection-items-1', 'collection-items-2', 'collection-items-4', 'retention-1', 'retention-2', 'security-1', 'security-2', 'privacy-officer-1'],
 '{}'::jsonb),
('B01', '삼성전자', 
 ARRAY['collection-purpose-1', 'collection-purpose-2', 'collection-items-1', 'collection-items-2', 'third-party-4', 'retention-1', 'retention-2', 'security-1', 'security-2', 'privacy-officer-1'],
 ARRAY['collection-purpose-1', 'collection-purpose-2', 'collection-items-1', 'collection-items-2', 'collection-items-4', 'retention-1', 'retention-2', 'security-1', 'security-2', 'privacy-officer-1'],
 '{}'::jsonb),
('B02', '삼성SDI', 
 ARRAY['collection-purpose-1', 'collection-purpose-2', 'collection-items-1', 'collection-items-2', 'third-party-4', 'retention-1', 'retention-2', 'security-1', 'security-2', 'privacy-officer-1'],
 ARRAY['collection-purpose-1', 'collection-purpose-2', 'collection-items-1', 'collection-items-2', 'collection-items-4', 'retention-1', 'retention-2', 'security-1', 'security-2', 'privacy-officer-1'],
 '{}'::jsonb)

ON CONFLICT (company_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  enabled_items = EXCLUDED.enabled_items,
  required_items = EXCLUDED.required_items,
  custom_settings = EXCLUDED.custom_settings,
  updated_at = NOW();
