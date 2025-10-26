"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState, useTransition, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/app/actions/auth";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PrivacyPolicyModal } from "@/components/PrivacyPolicyModal";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  // 회원가입 완료 메시지 표시
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'signup-success') {
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.');
    }
  }, [searchParams]);

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (!loading && user) {
      window.location.href = '/';
    }
  }, [user, loading]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success && result?.redirectTo) {
        toast.success(result.message || '로그인 성공');
        window.location.href = result.redirectTo;
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

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5 pt-0 px-0">
              {/* 이메일 입력 */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-normal">
                  아이디(이메일)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input 
                    id="email"
                    name="email"
                    type="text" 
                    placeholder="이메일을 입력해 주세요"
                    autoComplete="username"
                    className="h-12"
                    required
                  />
                  <div className="h-12 flex items-center px-3 border rounded-md bg-muted text-muted-foreground font-medium">
                    @hanwha.com
                  </div>
                </div>
              </div>
              
              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-normal">
                  비밀번호
                </Label>
                <div className="relative">
                  <Input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    autoComplete="current-password"
                    className="h-12 pr-10"
                    required
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
              
              {/* 로그인 버튼 */}
              <Button 
                type="submit"
                className="w-full h-12 text-lg font-medium"
                size="lg"
                disabled={isPending}
              >
                {isPending ? "로그인 중..." : "로그인"}
              </Button>
            </CardContent>
          </form>
          
          <CardFooter className="justify-center pb-0 px-0">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Link 
                href="/forgot-password" 
                className="hover:text-foreground transition-colors"
              >
                비밀번호 찾기
              </Link>
              <span className="text-border">|</span>
              <Link 
                href="/signup" 
                className="hover:text-foreground transition-colors"
              >
                회원가입
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        {/* 개인정보처리방침 버튼 */}
        <div className="flex justify-center mt-6">
          <PrivacyPolicyModal>
            <button type="button" className="text-sm font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
              개인정보처리방침
            </button>
          </PrivacyPolicyModal>
        </div>
        
        {/* 저작권 정보 */}
        <div className="text-center mt-2 text-xs text-muted-foreground">
          한화호텔앤드리조트(주) 서울특별시 중구 청계천로 86
        </div>
      </div>
    </div>
  );
}

