"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import {
  Save,
  Edit,
  Eye,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  FileText,
  Settings,
  Users,
  Shield,
  Mail,
} from "lucide-react"

// 크롤링된 한화호텔앤드리조트(주) 개인정보처리방침 데이터 구조
interface PrivacyItem {
  id: string
  category: string
  subcategory?: string
  title: string
  content: string
  required: boolean
  enabled: boolean
  version: string
  lastModified: string
  type: 'service' | 'privacy' | 'marketing' | 'third_party' | 'retention' | 'security'
}

interface CompanySettings {
  companyId: string
  companyName: string
  enabledItems: string[]
  requiredItems: string[]
  customSettings?: Record<string, any>
}

export function ExcelStyleAgreementManager() {
  // 크롤링된 한화호텔앤드리조트(주) 개인정보처리방침 데이터
  const [loading, setLoading] = React.useState(true)

  // 개인정보처리방침 관리 - 단순화된 구조
  const initialPrivacyItems: PrivacyItem[] = [
    // 1. 개인정보처리방침 (필수)
    {
      id: "privacy-policy",
      category: "개인정보처리방침",
      title: "개인정보처리방침",
      content: `한화호텔앤드리조트(주) 서비스 이용약관

시행일자: 2024년 9월 11일
버전: V1.0.0

제 1조 (목적)
본 약관은 회원이 주식회사 한화호텔앤드리조트(주)(이하 "회사"라 합니다)에서 제공하는 "한화호텔앤드리조트(주) Members서비스"를 이용하는 것과 관련하여 회원과 회사간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제 2조 (정의)
본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
1. "서비스"라 함은 회사가 제공하는 한화호텔앤드리조트(주) Members서비스를 의미합니다.
2. "회원"이라 함은 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 받는 자를 의미합니다.
3. "아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합을 의미합니다.
4. "비밀번호"라 함은 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 비밀보호를 위해 회원 자신이 정한 문자와 숫자의 조합을 의미합니다.
5. "해지"라 함은 회사 또는 회원이 서비스 이용계약을 해약하는 것을 의미합니다.

제 3조 (약관의 효력 및 변경)
1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
2. 회사는 합리적인 사유가 발생할 경우에는 이 약관을 변경할 수 있으며, 약관을 변경할 때에는 적용일자 및 변경사유를 명시하여 현행약관과 함께 서비스의 초기화면에 그 적용일자 7일 이전부터 공지합니다.
3. 회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.

제 4조 (약관 외 준칙)
본 약관에 명시되지 않은 사항에 대해서는 전기통신기본법, 전기통신사업법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률, 기타 관련 법령의 규정에 의합니다.

제 5조 (서비스의 제공 및 변경)
1. 회사는 다음과 같은 업무를 수행합니다.
   가. 서비스 제공
   나. 기타 회사가 정하는 업무
2. 회사는 서비스의 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 서비스의 내용을 변경할 수 있습니다. 이 경우에는 변경된 서비스의 내용 및 제공일자를 명시하여 현재의 서비스의 내용을 게시한 곳에 즉시 공지합니다.
3. 회사가 제공하기로 회원과 계약을 체결한 서비스를 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 회원에게 통지 가능한 주소로 즉시 통지합니다.

제 6조 (서비스의 중단)
1. 회사는 컴퓨터 등 정보통신설비의 보수점검·교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
2. 회사는 제1항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 회원 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.
3. 사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 회사는 제8조에 정한 방법으로 이용자에게 통지하고 당초 회사에서 제시한 조건에 따라 소비자에게 보상합니다. 다만, 회사가 보상기준 등을 고지하지 아니한 경우에는 이용자들의 마일리지 또는 적립금 등을 회사에서 통용되는 통화가치에 상응하는 현물 또는 현금으로 이용자에게 지급합니다.

제 7조 (회원가입)
1. 회원가입은 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 완료됩니다.
2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
   가. 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우, 다만 제8조 제3항에 의한 회원자격 상실 후 3개월이 경과한 자로서 회사의 회원 재가입 승낙을 얻은 경우는 예외로 합니다.
   나. 등록 내용에 허위, 기재누락, 오기가 있는 경우
   다. 기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우
3. 회원가입계약의 성립시기는 회사의 승낙이 회원에게 도달한 시점으로 합니다.
4. 회원은 제15조 제1항에 의한 등록사항에 변경이 있는 경우, 즉시 전자우편 기타 방법으로 회사에 대하여 그 변경사항을 알려야 합니다.

제 8조 (회원 탈퇴 및 자격 상실 등)
1. 회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.
2. 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다.
   가. 가입 신청 시에 허위 내용을 등록한 경우
   나. 회사, 회사의 다른 회원 또는 기타 제3자의 지적재산권을 침해하는 경우
   다. 다른 회원의 서비스 이용을 현저히 저해하는 경우
   라. 공공질서 및 미풍양속에 저해되는 내용을 유포하는 경우
   마. 범죄와 결부된다고 객관적으로 인정되는 경우
   바. 기타 관련 법령 위반 등으로 회원자격을 유지하기 어려운 경우
3. 회사가 회원 자격을 제한·정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 회사는 회원자격을 상실시킬 수 있습니다.
4. 회사가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.

제 9조 (회원에 대한 통지)
1. 회사가 회원에 대한 통지를 하는 경우, 회원이 회사와 미리 약정하여 지정한 전자우편 주소로 할 수 있습니다.
2. 회사는 불특정다수 회원에 대한 통지의 경우 1주일이상 회사 게시판에 게시함으로서 개별 통지에 갈음할 수 있습니다. 다만, 회원 본인의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별통지를 합니다.

제 10조 (회원의 의무)
1. 회원은 다음 행위를 하여서는 안 됩니다.
   가. 신청 또는 변경시 허위 내용의 등록
   나. 타인의 정보 도용
   다. 회사가 게시한 정보의 변경
   라. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
   마. 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해
   바. 회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
   사. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 회사에 공개 또는 게시하는 행위
2. 회원은 관계법, 이 약관의 규정, 이용안내 및 주의사항 등 회사가 통지하는 사항을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.

제 11조 (개인정보보호)
1. 회사는 이용자의 정보수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다.
2. 회사는 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다. 다만, 관련 법령상 의무이행을 위하여 구매계약이행 전 본인확인이 필요한 경우로서 최소한의 특정 개인정보를 수집하는 경우에는 그러하지 아니합니다.
3. 회사가 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
4. 회사는 수집된 개인정보를 목적외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. 다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다.
5. 회사가 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보관리책임자의 신원(소속, 성명 및 전화번호, 기타 연락처), 정보수집의 목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은자, 제공목적 및 제공할 정보의 내용) 등 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제22조제2항이 규정한 사항을 미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.
6. 이용자는 언제든지 회사가 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 회사는 이에 대해 지체 없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는 회사는 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.
7. 회사는 개인정보 보호를 위해 개인정보관리책임자를 지정하여 개인정보를 관리하고 있으며, 개인정보관리책임자의 지정 및 변경시에는 당해 사항을 공지합니다.

제 12조 (회사의 의무)
1. 회사는 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하는데 최선을 다하여야 합니다.
2. 회사는 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 구축하여야 합니다.
3. 회사는 상품이나 용역에 대하여 「표시·광고의 공정화에 관한 법률」 제3조 소정의 부당한 표시·광고행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.
4. 회사는 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.

제 13조 (회원과 이용자의 개인정보보호)
회사는 관련법령이 정하는 바에 따라서 이용자 등록정보를 포함한 이용자의 개인정보를 보호하기 위하여 노력합니다. 이용자의 개인정보보호에 관해서는 관련법령 및 회사가 정하는 개인정보처리방침에 정한 바에 의합니다.

제 14조 (회원의 ID 및 비밀번호에 대한 의무)
1. 제17조의 경우를 제외한 ID와 비밀번호에 관한 관리책임은 회원에게 있습니다.
2. 회원은 자신의 ID 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.
3. 회원이 자신의 ID 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 즉시 회사에 통보하고 회사의 안내가 있는 경우에는 그에 따라야 합니다.

제 15조 (이용자의 의무)
이용자는 다음 행위를 하여서는 안 됩니다.
1. 신청 또는 변경시 허위내용의 등록
2. 타인의 정보 도용
3. 회사가 게시한 정보의 변경
4. 회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시
5. 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해
6. 회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위
7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 회사에 공개 또는 게시하는 행위

제 16조 (연결"회사"와 피연결"회사" 간의 관계)
1. 상위 회사와 하위 회사가 연결된 경우, 전자를 연결"회사"(회사)로, 후자를 피연결"회사"(회원)로 지칭합니다.
2. 연결"회사"는 피연결"회사"가 독립적으로 제공하는 서비스에 대해서는 보증책임을 지지 않습니다.

제 17조 (저작권의 귀속 및 이용제한)
1. 회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.
2. 이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
3. 회사는 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.

제 18조 (분쟁해결)
1. 회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
2. 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
3. 회사와 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.

제 19조 (재판권 및 준거법)
1. 회사와 이용자 간에 발생한 전자상거래 분쟁에 관한 소송은 제소 당시의 이용자의 주소에 의하고, 주소가 없는 경우에는 거소를 관할하는 지방법원의 전속관할로 합니다. 다만, 제소 당시 이용자의 주소 또는 거소가 분명하지 않거나 외국 거주자의 경우에는 민사소송법상의 관할법원에 제기합니다.
2. 회사와 이용자 간에 제기된 전자상거래 소송에는 한국법을 적용합니다.

본 약관은 2024년 9월 11일부터 적용됩니다.`,
      required: true,
      enabled: true,
      version: "v1.0.0",
      lastModified: "2025-01-15",
      type: "service"
    },
    // 2. 개인정보처리방침 (필수)
    {
      id: "privacy-consent",
      category: "개인정보처리방침",
      title: "개인정보처리방침",
      content: `한화호텔앤드리조트(주) **개인정보처리방침**

시행일자: 2025년 10월 02일
버전: V1.1.0

1. 총칙

가. 개인정보란 생존하는 개인에 관한 정보로서 당해 정보에 포함되어 있는 성명, 주민등록번호 등의 사항에 의하여 당해 개인을 식별할 수 있는 정보 (당해 정보만으로는 특정 개인을 식별할 수 없더라도 다른 정보와 용이하게 결합하여 식별할 수 있는 것을 포함)를 말합니다.

나. 한화호텔앤드리조트(주)은 회원의 개인정보보호를 매우 중요시하며, "정보통신망 이용촉진 및 정보보호 등에 관한 법률"과 "개인정보보호법" 상의 개인정보보호규정을 준수하고 있습니다.

다. 한화호텔앤드리조트(주)은 개인정보처리방침의 지속적인 개선을 위하여 개인정보처리방침을 개정하는데 필요한 절차를 정하고 있습니다.

2. 개인정보 수집 및 이용목적

가. 한화호텔앤드리조트(주)은 이용자들에게 회원가입, 원활한 회원상담, 각종 서비스의 제공 등 보다 더 향상된 양질의 서비스를 제공하기 위하여 아래와 같이 회원 개인의 정보를 수집하고 있습니다.

- 회원관리: 서비스 이용에 따른 본인 확인, 개인식별, 불량회원의 부정이용 방지와 비인가 사용 방지, 미성년자의 확인, 회원상담, 회원불만 접수 및 처리, 분쟁조정을 위한 기록보존, 고지사항 전달
- 서비스 제공에 관한 계약의 이행 및 서비스 제공에 따른 요금정산: 서비스 및 부가 서비스 이용에 대한 요금 결제, 콘텐츠 제공, 이벤트/경품당첨 결과안내 및 상품배송, 금융거래 관련 본인인증 및 금융서비스, 강습계약서 발송, 구매 및 요금결제, 환불
- 마케팅 및 광고에 활용: 새로운 서비스 및 신상품이나 이벤트 정보 등의 안내, 회원에게 최적화된 서비스 제공, 개인맞춤 서비스를 제공하기 위한 자료, 마케팅 활용, 인구통계학적 특성에 따른 서비스 제공 및 광고 게재, 웹페이지 접속 빈도 파악, 서비스 이용에 대한 통계, 정기 간행물 발송, 새로운 상품 또는 서비스 안내, 회원 관심사에 부합하는 서비스 및 이벤트 기획, 경품행사, 이벤트 광고성 정보 전달 또는 회원 참여공간 운영, 회원설문조사, 서비스 및 상품 안내
- 온라인 프로그램에 활용: 회원에게 최적화 온라인 프로그램 서비스 제공, 서비스 품질 유지·관리 및 개선에 활용, 회원의 건강 정보를 바탕으로 맞춤형 건강 증진 서비스 및 건강정보 제공

3. 개인정보의 수집항목

가. 한화호텔앤드리조트(주)은 기본적인 서비스 제공을 위한 필수 정보만을 수집하고 있으며 회원 각각의 기호와 필요에 맞는 서비스를 제공하기 위한 정보 수집 시 별도 동의를 득하고 수집하고 있습니다.

나. 한화호텔앤드리조트(주)은 회원가입 및 상품 구매 시 다음의 항목 등과 같이 개인정보를 수집하여 이용합니다.

필수정보:
(1) 통합/준/정회원(온라인, CFC): 아이디, 비밀번호, 성명, 생년월일, 휴대폰번호, 성별, 국적, 회사명, 닉네임, 주소(자택), 사원번호, 이메일주소
(2) 대기회원(VANTT): 성명, 성별, 연령, 자택주소, 휴대폰번호, 관심회원권
(3) 정회원/개인(VANTT): 성명, 이메일주소, 휴대폰전화번호, 주소(자택), 보호자 연락처(미성년의 경우)
(4) 정회원/법인(VANTT): 대표자명(한글), 법인등록번호, 회사명, 주소(회사), 전화번호(회사), 성명, 성별, 주소(자택), 휴대폰번호, 이메일주소
(5) 정회원(서초): 성명, 성별, 생년월일, 주소(자택), 휴대폰번호, 이메일주소, 보호자 연락처(미성년인 경우)
(6) 네이버 SNS연동 서비스 이용 시: 네이버ID(이메일), 이용자 식별자
(7) 카카오 SNS연동 서비스 이용 시: 카카오ID(휴대폰번호), 생년월일, 이용자 식별자
(8) 애플 SNS연동 서비스 이용 시: 이메일, 이용자 식별자

고유식별 정보: 주민등록번호, CI, DI

선택정보:
(1) 피트니스 시설 이용 정보: 계좌번호(환불요청 시), 은행명(환불 요청 시), 예금주명(환불 요청 시), 차량정보, 직전 이용클럽, 반트를 알게 된 경로, 성명(영문), 회사명, 회사주소, 직급, 차량번호, 결혼기념일, 생년월일, 국적, 전화번호, 업종명, 업체명, 홈페이지 주소, 가입경로, 성별(SNS), 이메일(SNS)
(2) 걸음수 및 온라인 프로그램 이용 시: 디바이스 OS, OS Version, Model, APP Version(웨어러블 연동 시 Watch Model, Watch Version), 측정된 걸음수

민감 정보: 건강정보(운동 전 신체 준비 상태 설문지, Pra-q), 병력(수술여부, 심장질환, 당뇨, 혈압, 고지혈증, 기타), 건강검진결과(65세 이상의 경우, Par-q "예" 1항목 이상), 임신 주수 및 상태(의사소견서)

4. 개인정보 수집방법

가. 한화호텔앤드리조트(주)은 다음과 같은 방법으로 개인정보를 수집합니다.
- 홈페이지(PC/모바일), 모바일 앱, 서면양식를 통한 회원가입, 상담게시판, 프로모션응모, 서비스 제공
- 생성정보 수집 툴을 통한 수집
- 제휴사로부터의 제공

나. 회원께서는 필수정보, 고유식별정보 및 선택정보 수집에 대하여 거부할 권리를 가지며, 한화호텔앤드리조트(주)은 회원께서 한화호텔앤드리조트(주)의 개인정보 수집이용 동의서 또는 이용약관 각각의 내용에 대해 "동의" 또는 "동의하지 않음"을 선택할 수 있는 절차를 마련하여, "동의"를 선택한 경우 개인정보 수집에 대해 동의한 것으로 봅니다.

5. 개인정보 공유 및 제3자 제공

가. 한화호텔앤드리조트(주)은 회원의 동의가 있거나 관련 법령의 규정에 의한 경우를 제외하고는 어떠한 경우에도 "개인정보의 수집목적 및 이용목적"에서 고지한 범위를 넘어 회원의 개인정보를 이용하거나 외부에 제공하지 않습니다.

제공받은 자별 제공 내용:
- 인바디: 신체정보 측정을 위한 회원정보 제공 (회원번호, 성명, 성별, 나이, 키, 휴대폰번호, 사번, 한화호텔앤드리조트(주)밴드번호)
- 대양CSI: 회원 출입을 위한 회원정보 제공 (회원번호, 성명, 성별, 나이, 키, 휴대폰번호, 사번, 한화호텔앤드리조트(주)밴드번호)
- 모두싸인: 강습 계약을 위한 정보 제공 (이름, 생년월일, 주소, 연락처)
- 삼성전자, 삼성 E&A, 삼성 SDI: 근태시스템 출입정보 연동을 위한 정보 제공 (회원번호, 사번)
- 호텔신라: 한화호텔앤드리조트(주) 사내 시스템 연동을 위한 회원정보 제공 (주민등록번호, 외국인등록번호, 사업자등록번호, 법인등록번호, 회원명(한글), 회원명(영문), 성별, 국적, 우편번호, 핸드폰번호, 이메일, 생년월일, 회원번호)

6. 개인정보처리업무의 위탁

가. 한화호텔앤드리조트(주)은 서비스 이행을 위해 다음과 같이 개인정보 처리 업무를 외부 전문업체에 위탁하여 운영하고 있습니다.

- 한화호텔앤드리조트(주): 메가존 (전산시스템 유지보수 및 개발)
- 스카우트: 회원 상담 및 응대
- NICE평가정보: 본인인증을 위한 핸드폰 인증 및 아이핀 인증 대행
- 메가존클라우드: AWS 시스템 운영
- 한국정보통신: 신용카드, 신라페이 간편결제, 휴대폰, 계좌이체, 무통장입금을 통한 결제처리
- BIZTALK: 카카오 알림톡 발송 대행

7. 개인정보 보유 및 이용기간

가. 한화호텔앤드리조트(주)은 개인정보의 수집목적 또는 제공받은 목적이 달성된 때에는 회원의 개인정보를 지체 없이 파기합니다.

- 회원가입 정보: 회원가입을 탈퇴하거나 회원에서 제명된 때 (단, 부정 이용 방지를 위해, CI, DI 정보를 탈퇴하거나 회원에서·제명된 때로부터 6개월 동안 보관·이용 후 파기)
- 유/무료 상품 정보: 강습 또는 서비스 상품 이용이 종료한 때
- 설문조사, 이벤트 등의 목적을 위하여 수집한 경우: 당해 설문조사, 이벤트 등을 종료한 때
- 비회원의 상품구매정보: 서비스 이용계약 종료 후 관계 법령에서 정한 별도 보유기한 까지

나. 관련 법령의 규정에 의하여 일정기간 보유:
- 계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자 보호에 관한 법률)
- 대금결제 및 재화 등의 공급에 관한 기록: 5년
- 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
- 표시·광고에 관한 기록: 6개월
- 웹사이트 방문 기록: 3개월 (통신비밀보호법)

8. 개인정보 파기절차 및 방법

가. 파기절차: 이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.

나. 파기방법:
- 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
- 전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.

9. 개인정보 열람, 정정, 탈회 및 동의 철회 방법

가. 회원은 언제든지 등록되어 있는 개인정보를 열람 또는 정정 및 회원 탈퇴 할 수 있습니다.
- 홈페이지 로그인 후 [내정보수정] 메뉴를 통해, 개인정보를 열람 또는 수정할 수 있습니다.
- 회원 탈퇴는 홈페이지 로그인 후 [마이 > 내정보수정 > 계정탈퇴] 메뉴에서 가능합니다.
- 각 센터 대표전화 또는 서면, 이메일로 연락하시면 본인 확인 절차를 거쳐 지체없이 조치하겠습니다.
  * 전화번호: 02-2058-1501
  * 전자우편: yongnam86.jeon@samsung.com
  * 팩스번호: 02-3498-0079
  * 주소: 서울시 강남구 언주로30길 26, M1층 호텔신라 사무실(도곡동)
  * 방문: 각 피트니스 센터 (※ 피트니스 센터 위치는 홈페이지 상단 '센터안내' 참조)

10. 이용자 및 법정대리인의 권리와 그 행사방법

가. 회원은 언제든지 등록되어 있는 회원의 개인정보를 열람하거나 정정, 삭제, 처리정지 및 동의철회를 요청할 수 있으며 이에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다.

11. 가명정보의 처리

가. 가명정보는 개인정보의 일부를 삭제하거나 일부 또는 전부를 대체하는 등의 방법으로 추가 정보가 없이는 특정 개인을 알아볼 수 없도록 처리한 정보를 말합니다.

나. 한화호텔앤드리조트(주)은 통계 작성, 과학적 연구 등의 목적으로 가명정보를 활용할 수 있습니다.

12. 개인정보의 안전성 확보 조치

한화호텔앤드리조트(주)은 회원의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 누출, 변조 또는 훼손되지 않도록 안전성 확보를 위해 다음과 같은 기술적, 관리적, 물리적 대책을 강구하고 있습니다.

- 개인정보 취급 직원의 최소화 및 교육
- 정기적인 자체 감사 실시
- 내부관리계획의 수립 및 시행
- 개인정보의 암호화
- 해킹 등에 대비한 기술적 대책
- 개인정보에 대한 접근 제한
- 접속기록의 보관 및 위변조 방지
- 문서보안을 위한 잠금장치 사용
- 비인가자에 대한 출입 통제

13. 의견수렴 및 불만처리

가. 당사는 회원님의 의견을 소중하게 생각하며, 회원님은 의문사항으로부터 언제나 성실한 답변을 받을 권리가 있습니다.

【한화호텔앤드리조트(주) Members 관리자】
- 전자우편: dongjin.ko@samsung.com
- 전화번호: 02-2058-1501
- 팩스번호: 02-3498-0079
- 주소: 서울시 강남구 언주로30길 26, M1층 호텔신라 사무실(도곡동)

나. 전화상담은 오전 9시 ~ 오후 6시에만 가능합니다. 전자우편이나 팩스 및 우편을 이용한 상담은 접수 후 24시간 내에 성실하게 답변 드리겠습니다.

다. 기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
- 개인정보침해신고센터(privacy.kisa.or.kr / 국번없이 118)
- 개인정보분쟁조정위원회(www.kopico.go.kr / 1833-6972)
- 대검찰청 사이버수사과(www.spo.go.kr / 국번없이 1301)
- 경찰청 사이버수사국(https://ecrm.police.go.kr / 국번없이 182)

14. 개인정보보호책임자

한화호텔앤드리조트(주)은 회원의 개인정보를 보호하고 개인정보에 대한 의견수렴 및 불만처리를 담당하기 위하여 아래와 같이 관련부서 및 개인정보보호책임자를 지정하고 있습니다.

- 개인정보보호책임자: 김회선 (경영지원그룹, CPO, 02-2028-1501, hoesun.kim@samsung.com)
- 개인정보보호관리자: 윤영준 (CFC사업그룹, 그룹장, 02-2028-1501, Duhwan.yang@samsung.com)
- 개인정보보호관리자: 최금성 (레포츠사업그룹, 그룹장, 02-2028-1501, Ksstar.choi@samsung.com)
- 개인정보보호담당자: 전용남 (IT 개발 파트, 프로, 02-2028-1501, yongnam86.jeon@samsung.com)

15. 광고성 정보 전송

가. 한화호텔앤드리조트(주)은 회원의 사전 동의 없이 영리목적의 광고성 정보를 전송하지 않습니다.

나. 한화호텔앤드리조트(주)은 (신)상품 또는 이벤트 정보안내 등 회원에게 최적화된 마케팅을 위해 광고성 정보를 전자우편으로 전송하는 경우에는 광고성 정보 전송에 대한 회원의 사전동의를 구한 후, 전자우편의 제목란 및 본문란에 다음 사항과 같이 회원께서 쉽게 알아 볼 수 있도록 조치합니다.
- 제목란: 제목이 시작되는 부분에 "광고"라는 표시를 함
- 본문란: 이용자가 수신거부의 의사표시를 할 수 있는 전송자의 명칭, 연락처, 전자우편, 주소, 및 수신동의 철회에 대한 안내문

16. 링크사이트

가. 한화호텔앤드리조트(주)은 회원께 다른 회사의 웹사이트 또는 자료에 대한 링크를 제공할 수 있습니다. 이 경우 한화호텔앤드리조트(주)은 외부사이트 및 자료에 대한 아무런 통제권이 없으므로 그로부터 제공받는 서비스나 자료의 유용성에 대해 책임질 수 없으며 보증할 수 없습니다.

17. 게시물

가. 한화호텔앤드리조트(주)은 회원의 게시물을 소중하게 생각하며 변조, 훼손, 삭제되지 않도록 최선을 다하여 보호합니다.

18. 고지의 의무

법률의 제개정, 정부의 정책 변경, 한화호텔앤드리조트(주) 코퍼레이션내부방침의 변경 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 홈페이지를 통해 변경이유 및 내용 등을 공지하도록 하겠습니다.

- 개인정보처리방침 버전번호: [V1.1.0]
- 개인정보처리방침 시행일자: 2025년 10월 02일
- 개인정보처리방침 최종변경일자: 2025년 09월 26일

이상의 한화호텔앤드리조트(주) 홈페이지 개인정보처리방침은 2025년 10월 02일부터 적용됩니다.`,
      required: true,
      enabled: true,
      version: "v1.0.0",
      lastModified: "2025-01-15",
      type: "privacy"
    },
    // 3. 개인정보처리방침 (선택)
    {
      id: "marketing-consent",
      category: "개인정보처리방침",
      title: "개인정보처리방침",
      content: `한화호텔앤드리조트(주) 마케팅정보 수집 및 이용 동의

시행일자: 2025년 10월 02일
버전: V1.0.0

1. 마케팅 정보 수집 및 이용 목적

한화호텔앤드리조트(주)(이하 "회사")은 다음과 같은 목적으로 마케팅 정보를 수집 및 이용합니다:

가. 마케팅 및 광고에 활용
- 새로운 서비스 및 신상품이나 이벤트 정보 등의 안내
- 회원에게 최적화된 서비스 제공
- 개인맞춤 서비스를 제공하기 위한 자료, 마케팅 활용
- 인구통계학적 특성에 따른 서비스 제공 및 광고 게재
- 웹페이지 접속 빈도 파악
- 서비스 이용에 대한 통계
- 정기 간행물 발송, 새로운 상품 또는 서비스 안내
- 회원 관심사에 부합하는 서비스 및 이벤트 기획
- 경품행사, 이벤트 광고성 정보 전달 또는 회원 참여공간 운영
- 회원설문조사
- 서비스 및 상품 안내

나. 온라인 프로그램에 활용
- 회원에게 최적화 온라인 프로그램 서비스 제공
- 서비스 품질 유지·관리 및 개선에 활용
- 회원의 건강 정보를 바탕으로 맞춤형 건강 증진 서비스 및 건강정보 제공

2. 수집하는 마케팅 정보의 항목

가. 필수 수집 항목
- 성명, 이메일주소, 휴대폰번호
- 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보

나. 선택 수집 항목
- 생년월일, 성별, 관심사항
- 마케팅 정보 수신 이력
- 이벤트 참여 이력
- 서비스 이용 패턴 및 선호도

3. 마케팅 정보 수집 방법

가. 회원가입 시 동의를 통한 수집
나. 서비스 이용 중 자동 수집
다. 이벤트 참여 시 수집
라. 설문조사 참여 시 수집

4. 마케팅 정보 이용 및 제공

가. 회사 내부 이용
- 회원 맞춤형 서비스 제공
- 마케팅 전략 수립 및 실행
- 서비스 개선 및 신규 서비스 개발

나. 제3자 제공
회사는 마케팅 정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우는 예외로 합니다:
- 회원의 사전 동의가 있는 경우
- 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

5. 마케팅 정보 보유 및 이용기간

가. 회원 탈퇴 시까지 보유 및 이용
나. 마케팅 정보 수집 동의 철회 시까지 보유 및 이용
다. 관련 법령에 의해 일정기간 보유가 필요한 경우 해당 기간까지 보유

6. 마케팅 정보 수신 동의 및 철회

가. 동의 방법
- 회원가입 시 마케팅 정보 수신 동의
- 서비스 이용 중 추가 동의
- 이벤트 참여 시 동의

나. 동의 철회 방법
- 홈페이지: 마이페이지 > 개인정보 수정 > 마케팅 정보 수신 동의 해지
- 이메일: 수신거부 링크 클릭
- 전화: 고객센터(02-2058-1501)를 통한 철회 요청
- 서면: 서울시 강남구 언주로30길 26, M1층 호텔신라 사무실(도곡동)로 우편 발송

다. 동의 철회 시 불이익
- 마케팅 정보 수신 동의를 철회하실 경우, 맞춤형 서비스 제공이 제한될 수 있습니다.
- 이벤트 및 프로모션 정보를 받아보실 수 없습니다.

7. 광고성 정보 전송

가. 전송 방법
- 이메일, SMS, 앱 푸시 알림, 전화 등을 통한 전송

나. 전송 내용
- 신상품 및 서비스 안내
- 이벤트 및 프로모션 정보
- 맞춤형 상품 추천
- 설문조사 및 리뷰 요청

다. 전송 시 주의사항
- 광고성 정보임을 명시
- 수신거부 방법 안내
- 발송자 정보 명시

8. 개인정보보호를 위한 조치

가. 기술적 조치
- 개인정보 암호화
- 접근 권한 관리
- 보안 프로그램 설치 및 운영

나. 관리적 조치
- 개인정보보호 교육 실시
- 개인정보보호 정책 수립 및 시행
- 정기적인 보안 점검

9. 마케팅 정보 관련 문의

가. 문의처
- 전화: 02-2058-1501
- 이메일: yongnam86.jeon@samsung.com
- 주소: 서울시 강남구 언주로30길 26, M1층 호텔신라 사무실(도곡동)

나. 문의 가능 시간
- 평일: 오전 9시 ~ 오후 6시
- 이메일 문의: 24시간 접수 (답변은 영업일 기준 24시간 이내)

10. 동의 거부 권리

이용자는 마케팅 정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 동의를 거부하실 경우 맞춤형 서비스 제공이 제한될 수 있습니다.

11. 약관의 변경

회사는 관련 법령을 준수하며, 마케팅 정보 수집 및 이용에 관한 사항을 변경할 경우에는 변경사항을 홈페이지에 공지합니다.

본 동의서는 2025년 10월 02일부터 적용됩니다.`,
      required: false,
      enabled: true,
      version: "v1.0.0",
      lastModified: "2025-01-15",
      type: "marketing"
    }
  ]

  const [privacyItems, setPrivacyItems] = React.useState<PrivacyItem[]>(initialPrivacyItems)
  const [editingItem, setEditingItem] = React.useState<PrivacyItem | null>(null)
  const [selectedCategory, setSelectedCategory] = React.useState("all")
  const [searchTerm, setSearchTerm] = React.useState("")

  const [companySettings, setCompanySettings] = React.useState<CompanySettings[]>([
    {
      companyId: "B01",
      companyName: "한화건설",
      enabledItems: ["service-terms", "privacy-consent", "marketing-consent"],
      requiredItems: ["service-terms", "privacy-consent"]
    }
  ])

  React.useEffect(() => {
    loadPrivacyItems()
  }, [])

  const loadPrivacyItems = async () => {
    try {
      const response = await fetch('/api/privacy-items', {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (result.success && result.data) {
        // item_type을 type으로 변환
        const items = result.data.map((item: any) => ({
          ...item,
          type: item.item_type,
          lastModified: item.last_modified || item.lastModified
        }))
        setPrivacyItems(items)
      }
    } catch (error) {
      console.error('Failed to load privacy items:', error)
    } finally {
      setLoading(false)
    }
  }

  // 필터링된 데이터
  const filteredItems = React.useMemo(() => {
    // 3개 고정 키를 기준으로 정렬: 개인정보처리방침, 서비스 이용약관, 개인정보 수집 및 이용 동의
    const order: Record<string, number> = {
      '개인정보처리방침': 1,
      '서비스 이용약관': 2,
      '개인정보 수집 및 이용 동의': 3,
    }
    const items = [...privacyItems]
    items.sort((a, b) => (order[a.category] || 99) - (order[b.category] || 99))

    let filtered = items
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      filtered = filtered.filter(item =>
        (item.title || '').toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q)
      )
    }
    return filtered
  }, [privacyItems, selectedCategory, searchTerm])

  const categories = React.useMemo(() => {
    return Array.from(new Set(privacyItems.map(item => item.category)))
  }, [privacyItems])

  const handleSaveItem = async (item: PrivacyItem) => {
    try {
      const response = await fetch('/api/privacy-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'saveItem',
          data: {
            ...item,
            item_type: item.type, // type을 item_type으로 변환
            last_modified: new Date().toISOString().split('T')[0]
          }
        })
      })

      const result = await response.json()

      // HTTP 응답 상태 확인
      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`)
      }

      setPrivacyItems(prev => prev.map(i => i.id === item.id ? { ...item, lastModified: new Date().toISOString().split('T')[0] } : i))
      // 홈페이지 동기화 트리거
      await syncToHomepage(item.id, item)
      toast.success('항목이 저장되었습니다.', {
        description: `${item.title}이(가) 성공적으로 저장되었습니다.`
      })
      setEditingItem(null)
    } catch (error) {
      console.error('Save item error:', error)
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
      toast.error(`항목 저장에 실패했습니다: ${errorMessage}`)
    }
  }

  // 홈페이지 동기화
  const syncToHomepage = async (itemId: string, item: PrivacyItem) => {
    try {
      const response = await fetch('/api/privacy-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'syncItem',
          data: { itemId, item }
        })
      })

      if (!response.ok) {
        const text = await response.text().catch(() => '')
        let detail = text
        try { detail = JSON.parse(text)?.error || text } catch {}
        throw new Error(`Sync failed${detail ? `: ${detail}` : ''}`)
      }

      console.log('Successfully synced to homepage')
    } catch (error) {
      console.error('Homepage sync error:', error)
      // 동기화 실패는 사용자에게 알리지 않음 (백그라운드 작업)
    }
  }

  // 아이템 삭제
  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch('/api/privacy-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'deleteItem',
          data: { id }
        })
      })

      const result = await response.json()
      if (result.success) {
        setPrivacyItems(prev => prev.filter(item => item.id !== id))
        toast.success('항목이 삭제되었습니다.')
      } else {
        throw new Error(result.error || 'Failed to delete item')
      }
    } catch (error) {
      console.error('Delete item error:', error)
      toast.error('항목 삭제에 실패했습니다.')
    }
  }

  // 아이템 복사
  const handleCopyItem = async (item: PrivacyItem) => {
    try {
      const newItem = {
        ...item,
        id: `${item.id}-copy-${Date.now()}`,
        title: `${item.title} (복사본)`,
        lastModified: new Date().toISOString().split('T')[0]
      }

      const response = await fetch('/api/privacy-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'saveItem',
          data: {
            ...newItem,
            last_modified: new Date().toISOString().split('T')[0]
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        setPrivacyItems(prev => [...prev, newItem])
        toast.success('항목이 복사되었습니다.')
      } else {
        throw new Error(result.error || 'Failed to copy item')
      }
    } catch (error) {
      console.error('Copy item error:', error)
      toast.error('항목 복사에 실패했습니다.')
    }
  }

  // 새 아이템 추가
  const handleAddItem = async () => {
    try {
      const newItem: PrivacyItem = {
        id: `new-item-${Date.now()}`,
        category: "새 동의서 유형",
        title: "새 항목",
        content: "",
        required: false,
        enabled: true,
        version: "v1.0.0",
        lastModified: new Date().toISOString().split('T')[0],
        type: "privacy"
      }

      const response = await fetch('/api/privacy-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'saveItem',
          data: {
            ...newItem,
            last_modified: new Date().toISOString().split('T')[0]
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        setPrivacyItems(prev => [...prev, newItem])
        setEditingItem(newItem)
        toast.success('새 항목이 추가되었습니다.')
      } else {
        throw new Error(result.error || 'Failed to add item')
      }
    } catch (error) {
      console.error('Add item error:', error)
      toast.error('새 항목 추가에 실패했습니다.')
    }
  }

  // 개인정보처리방침 새 항목 추가 (단순화)
  const handleAddPrivacyPolicy = () => {
    const newItem: PrivacyItem = {
      id: `privacy-policy-${Date.now()}`,
      category: "개인정보처리방침",
      title: "개인정보처리방침",
      content: "개인정보처리방침 내용을 입력하세요.",
      required: true,
      enabled: true,
      version: "v1.0.0",
      lastModified: new Date().toISOString().split('T')[0],
      type: "privacy"
    }
    setPrivacyItems(prev => [...prev, newItem])
    setEditingItem(newItem)
  }

  // 회사별 설정 업데이트
  const handleUpdateCompanySettings = (companyId: string, enabledItems: string[], requiredItems: string[]) => {
    setCompanySettings(prev => prev.map(setting => 
      setting.companyId === companyId 
        ? { ...setting, enabledItems, requiredItems }
        : setting
    ))
    toast.success('회사별 설정이 업데이트되었습니다.')
  }

  // 항목별 표시 (단순화)
  const getItemDisplay = (type: PrivacyItem['type']) => {
    switch (type) {
      case 'service':
        return '서비스 이용약관'
      case 'privacy':
        return '개인정보 수집 및 이용 동의'
      case 'marketing':
        return '마케팅 동의'
      case 'third_party':
        return '제3자 제공'
      case 'retention':
        return '보유기간'
      case 'security':
        return '보안'
      default:
        return type
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">로딩 중...</div>
  }

  return (
    <div className="space-y-6">
      {/* 헤더 - 한화호텔앤드리조트(주) 사이트와 동일한 구조 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            서비스 이용약관 및 개인정보수집동의 관리
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            한화호텔앤드리조트(주) 서비스 이용약관과 개인정보수집동의를 관리합니다.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="category-filter">카테고리:</Label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border rounded-md"
                >
                  <option value="all">전체</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="search">검색:</Label>
                <Input
                  id="search"
                  placeholder="제목, 내용, 카테고리 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleAddPrivacyPolicy} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                개인정보처리방침 추가
              </Button>
              <Button onClick={() => {
                const newItem: PrivacyItem = {
                  id: `service-terms`,
                  category: "서비스 이용약관",
                  title: "서비스 이용약관",
                  content: "",
                  required: true,
                  enabled: true,
                  version: "v1.0.0",
                  lastModified: new Date().toISOString().split('T')[0],
                  type: "service"
                }
                setPrivacyItems(prev => [...prev, newItem])
                setEditingItem(newItem)
              }} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                서비스 약관 추가
              </Button>
              <Button onClick={() => {
                const newItem: PrivacyItem = {
                  id: `privacy-consent`,
                  category: "개인정보 수집 및 이용 동의",
                  title: "개인정보 수집 및 이용 동의",
                  content: "",
                  required: true,
                  enabled: true,
                  version: "v1.0.0",
                  lastModified: new Date().toISOString().split('T')[0],
                  type: "privacy"
                }
                setPrivacyItems(prev => [...prev, newItem])
                setEditingItem(newItem)
              }} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                개인정보 수집 동의 추가
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                가져오기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 엑셀 스타일 테이블 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">번호</TableHead>
                  <TableHead className="w-24">항목</TableHead>
                  <TableHead className="w-48">동의서 유형</TableHead>
                  <TableHead className="w-32">하위카테고리</TableHead>
                  <TableHead className="w-64">제목</TableHead>
                  <TableHead className="min-w-96">내용</TableHead>
                  <TableHead className="w-20">필수</TableHead>
                  <TableHead className="w-20">활성</TableHead>
                  <TableHead className="w-20">버전</TableHead>
                  <TableHead className="w-24">수정일</TableHead>
                  <TableHead className="w-32">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      {getItemDisplay(item.type)}
                    </TableCell>
                    <TableCell className="text-sm">{item.category}</TableCell>
                    <TableCell className="text-sm">{item.subcategory || "-"}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-sm max-w-96 truncate" title="">
                      {/* 내용은 공간만 확보하고 표시하지 않음 */}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.required ? "destructive" : "secondary"}>
                        {item.required ? "필수" : "선택"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.enabled ? "default" : "secondary"}>
                        {item.enabled ? "활성" : "비활성"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{item.version}</TableCell>
                    <TableCell className="text-sm">{item.lastModified}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyItem(item)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 편집 모달 */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>항목 편집</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Input
                    id="category"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory">하위카테고리</Label>
                  <Input
                    id="subcategory"
                    value={editingItem.subcategory || ""}
                    onChange={(e) => setEditingItem({...editingItem, subcategory: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
                  rows={6}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">항목</Label>
                  <select
                    id="type"
                    value={editingItem.type}
                    onChange={(e) => setEditingItem({...editingItem, type: e.target.value as PrivacyItem['type']})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="service">서비스 이용약관</option>
                    <option value="privacy">개인정보 수집·이용</option>
                    <option value="marketing">마케팅 동의</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="version">버전</Label>
                  <Input
                    id="version"
                    value={editingItem.version}
                    onChange={(e) => setEditingItem({...editingItem, version: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="required"
                    checked={editingItem.required}
                    onCheckedChange={(checked) => setEditingItem({...editingItem, required: checked})}
                  />
                  <Label htmlFor="required">필수</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="enabled"
                    checked={editingItem.enabled}
                    onCheckedChange={(checked) => setEditingItem({...editingItem, enabled: checked})}
                  />
                  <Label htmlFor="enabled">활성</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  취소
                </Button>
                <Button onClick={() => handleSaveItem(editingItem)}>
                  <Save className="h-4 w-4 mr-2" />
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  )
}