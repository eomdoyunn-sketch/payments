"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { useState, useTransition, useEffect } from "react";
import { Eye, EyeOff, FileText, ExternalLink } from "lucide-react";
import { signup } from "@/app/actions/auth";
import { getActiveCompanies } from "@/app/actions/companies";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AGREEMENTS } from "@/lib/agreements";

type Company = {
  code: string;
  name: string;
  status: string;
};

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [gender, setGender] = useState<string>("male");
  const [companyCode, setCompanyCode] = useState<string>("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [serviceAgreed, setServiceAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  // 마케팅 동의는 회원가입 시 비활성화
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // 계열사 목록 로드
  useEffect(() => {
    async function loadCompanies() {
      try {
        console.log('Loading companies...');
        setCompaniesLoading(true);
        const companiesList = await getActiveCompanies();
        console.log('Companies loaded:', companiesList);
        setCompanies(companiesList);
        
        if (companiesList.length === 0) {
          console.warn('No active companies found');
          toast.error('계열사 목록을 불러올 수 없습니다. 관리자에게 문의하세요.');
        }
      } catch (error) {
        console.error('Error loading companies:', error);
        toast.error('계열사 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setCompaniesLoading(false);
      }
    }
    loadCompanies();
  }, []);

  async function handleSubmit(formData: FormData) {
    // 계열사 선택 검증
    if (!companyCode) {
      toast.error('계열사를 선택해주세요.');
      return;
    }

    // FormData에 체크박스, 라디오 버튼, 계열사 값 추가
    formData.append('gender', gender);
    formData.append('companyCode', companyCode);
    formData.append('serviceAgreed', serviceAgreed.toString());
    formData.append('privacyAgreed', privacyAgreed.toString());
    // 마케팅 동의는 회원가입 시 비활성화

    startTransition(async () => {
      const result = await signup(formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success(result.message);
        // 성공 후 로그인 페이지로 리다이렉트
        router.push('/login?message=signup-success');
      }
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl">
        <Card className="p-6">
          {/* 로고 */}
          <div className="flex justify-center mb-2 mt-2">
            <Image 
              src="/assets/GYM_29_로고배경없음_jpg.png" 
              alt="GYM 29 Logo" 
              width={280} 
              height={84}
              priority
            />
          </div>

          <form action={handleSubmit}>
            {/* Hidden inputs for agreement status */}
            <input type="hidden" name="termsAgreed" value={serviceAgreed ? 'true' : 'false'} />
            <input type="hidden" name="privacyAgreed" value={privacyAgreed ? 'true' : 'false'} />
            <input type="hidden" name="marketingAgreed" value="false" />
            
            <CardContent className="space-y-5 pt-0 px-0">
              {/* 이름 및 사번 입력 - 모바일에서는 세로, 태블릿 이상에서는 가로 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-normal">
                    이름
                  </Label>
                  <Input 
                    id="name"
                    name="name"
                    type="text" 
                    placeholder="이름 입력"
                    autoComplete="name"
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId" className="text-base font-normal">
                    사번
                  </Label>
                  <Input 
                    id="employeeId"
                    name="employeeId"
                    type="text" 
                    placeholder="사번 입력"
                    className="h-12"
                    required
                  />
                </div>
              </div>

              {/* 전화번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-normal">
                  전화번호
                </Label>
                <Input 
                  id="phone"
                  name="phone"
                  type="tel" 
                  placeholder="010-1234-5678"
                  autoComplete="tel"
                  className="h-12"
                  pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
                />
                <p className="text-xs text-muted-foreground">
                  예: 010-1234-5678 (선택사항)
                </p>
              </div>

              {/* 이메일 입력 - 항상 가로 배치 (좁은 공간에서도 괜찮음) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-normal">
                  아이디(이메일)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    id="email"
                    name="email"
                    type="text" 
                    placeholder="example"
                    autoComplete="username"
                    className="h-12"
                    required
                  />
                  <div className="h-12 flex items-center px-3 border rounded-md bg-muted text-muted-foreground font-medium text-sm sm:text-base">
                    @hanwha.com
                  </div>
                </div>
              </div>
            
              {/* 비밀번호 및 비밀번호 확인 - 모바일에서는 세로, 태블릿 이상에서는 가로 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-normal">
                    비밀번호
                  </Label>
                  <div className="relative">
                    <Input 
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="******"
                      autoComplete="new-password"
                      className="h-12 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm" className="text-base font-normal">
                    비밀번호 확인
                  </Label>
                  <div className="relative">
                    <Input 
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type={showPasswordConfirm ? "text" : "password"}
                      placeholder="******"
                      autoComplete="new-password"
                      className="h-12 pr-10"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPasswordConfirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 성별 선택 - Tabs 컴포넌트 사용 */}
              <div className="space-y-2">
                <Label className="text-base font-normal">
                  성별
                </Label>
                <Tabs value={gender} onValueChange={setGender} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 h-12">
                    <TabsTrigger value="male" className="text-base data-[state=active]:font-semibold">
                      남성
                    </TabsTrigger>
                    <TabsTrigger value="female" className="text-base data-[state=active]:font-semibold">
                      여성
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* 계열사 선택 */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-base font-normal">
                  계열사
                </Label>
                <Select value={companyCode} onValueChange={setCompanyCode} required>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder={
                      companiesLoading 
                        ? "계열사 목록을 불러오는 중..." 
                        : companies.length === 0
                        ? "계열사가 없습니다"
                        : "계열사를 선택하세요"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        {companiesLoading ? "로딩 중..." : "등록된 계열사가 없습니다"}
                      </div>
                    ) : (
                      companies.map((company) => (
                        <SelectItem key={company.code} value={company.code} className="text-base">
                          {company.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                
                {/* 디버깅 정보 */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-muted-foreground">
                    디버깅: {companies.length}개 계열사 로드됨
                  </div>
                )}
              </div>

              {/* 약관 동의 - SHP 구조 적용 */}
              <div className="space-y-4 pt-2">
                {/* 서비스 이용약관 (필수) */}
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="service"
                    checked={serviceAgreed}
                    onCheckedChange={(checked) => setServiceAgreed(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="service"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <span className="text-foreground">GYM29 서비스 이용약관</span>
                      <Badge variant="destructive" className="text-xs">필수</Badge>
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            약관보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>GYM29 서비스 이용약관</DialogTitle>
                          </DialogHeader>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {AGREEMENTS.find(a => a.type === 'service')?.content}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                {/* 개인정보 수집·이용 동의서 (필수) */}
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="privacy"
                    checked={privacyAgreed}
                    onCheckedChange={(checked) => setPrivacyAgreed(checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="privacy"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                    >
                      <span className="text-foreground">개인정보 수집·이용 동의서</span>
                      <Badge variant="destructive" className="text-xs">필수</Badge>
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            약관보기
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>개인정보 수집·이용 동의서</DialogTitle>
                          </DialogHeader>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {AGREEMENTS.find(a => a.type === 'privacy')?.content}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                {/* 마케팅 동의는 회원가입 시 비활성화 - 결제 시에도 동의서 없음 */}
              </div>
              
              {/* 회원가입 버튼 */}
              <Button 
                type="submit"
                className="w-full h-12 text-lg font-medium bg-[#FF7A00] hover:bg-[#E66D00] text-white"
                size="lg"
                disabled={isPending || !serviceAgreed || !privacyAgreed || !companyCode}
              >
                {isPending ? "가입 중..." : "회원가입"}
              </Button>
            </CardContent>
          </form>
          
          <CardFooter className="justify-center pb-0 px-0">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              이미 계정이 있으신가요?{" "}
              <Link 
                href="/login" 
                className="text-primary font-medium hover:underline"
              >
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

