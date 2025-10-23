"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, User } from 'lucide-react';
import { logout } from '@/app/actions/auth';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    employee_id?: string;
    company_name?: string;
    role?: string;
  };
}

export default function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 현재 사용자 정보 가져오기
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('사용자 정보 가져오기 실패:', error);
        } else {
          setUser(user);
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('인증 상태 변화:', event, session?.user?.email);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2">인증 상태 확인 중...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            인증 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">로그인이 필요합니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          인증 상태
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium text-muted-foreground">이름:</span>
            <span className="ml-2">{user.user_metadata?.name || '정보 없음'}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">이메일:</span>
            <span className="ml-2">{user.email || '정보 없음'}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">사번:</span>
            <span className="ml-2">{user.user_metadata?.employee_id || '정보 없음'}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">계열사:</span>
            <span className="ml-2">{user.user_metadata?.company_name || '정보 없음'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">역할:</span>
            <Badge variant={user.user_metadata?.role === 'admin' ? 'destructive' : 'secondary'}>
              {user.user_metadata?.role === 'admin' ? '관리자' : '사용자'}
            </Badge>
          </div>
        </div>
        
        <Button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="outline"
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
        </Button>
      </CardContent>
    </Card>
  );
}
