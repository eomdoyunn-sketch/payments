"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AgreementModal } from "@/components/common/AgreementModal";
import { AGREEMENTS } from "@/lib/agreements";

interface TermsAgreementProps {
  onAgreementChange?: (agreements: { service: boolean; privacy: boolean }) => void;
  className?: string;
}

export function TermsAgreement({ onAgreementChange, className }: TermsAgreementProps) {
  const [serviceAgreed, setServiceAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const handleServiceChange = (checked: boolean) => {
    setServiceAgreed(checked);
    onAgreementChange?.({ service: checked, privacy: privacyAgreed });
  };

  const handlePrivacyChange = (checked: boolean) => {
    setPrivacyAgreed(checked);
    onAgreementChange?.({ service: serviceAgreed, privacy: checked });
  };

  const handleAllAgree = (checked: boolean) => {
    setServiceAgreed(checked);
    setPrivacyAgreed(checked);
    onAgreementChange?.({ service: checked, privacy: checked });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-center">서비스 이용약관 및 개인정보수집동의</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          GYM29 서비스 이용약관과 개인정보수집동의를 해주세요.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 모두 동의 */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="allAgree"
            checked={serviceAgreed && privacyAgreed}
            onCheckedChange={handleAllAgree}
            className="mt-1"
          />
          <label
            htmlFor="allAgree"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            모두 동의합니다.
          </label>
        </div>

        {/* 개별 동의 항목들 */}
        <div className="space-y-3">
          {/* 서비스 이용약관 (필수) */}
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="service"
              checked={serviceAgreed}
              onCheckedChange={handleServiceChange}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="service"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <span className="text-foreground">[필수] 통합-서비스 이용약관</span>
              </label>
              <div className="flex items-center gap-2 mt-1">
                <AgreementModal
                  title="[필수] 통합-서비스 이용약관"
                  content={AGREEMENTS.find(a => a.type === 'service')?.content || ''}
                >
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    약관보기
                  </Button>
                </AgreementModal>
              </div>
            </div>
          </div>

          {/* 개인정보 수집·이용 동의서 (필수) */}
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="privacy"
              checked={privacyAgreed}
              onCheckedChange={handlePrivacyChange}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="privacy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
              >
                <span className="text-foreground">[필수] 통합-개인정보 수집 및 이용동의</span>
              </label>
              <div className="flex items-center gap-2 mt-1">
                <AgreementModal
                  title="[필수] 통합-개인정보 수집 및 이용동의"
                  content={AGREEMENTS.find(a => a.type === 'privacy')?.content || ''}
                >
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    약관보기
                  </Button>
                </AgreementModal>
              </div>
            </div>
          </div>
        </div>

        {/* 동의 상태 표시 */}
        <div className="text-xs text-muted-foreground">
          서비스 이용약관: {serviceAgreed ? "동의" : "미동의"} | 
          개인정보 수집·이용: {privacyAgreed ? "동의" : "미동의"}
        </div>
      </CardContent>
    </Card>
  );
}

