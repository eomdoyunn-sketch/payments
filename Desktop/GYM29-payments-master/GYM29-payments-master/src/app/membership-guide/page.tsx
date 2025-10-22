import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Clock, Users, Shield, Star, CheckCircle } from 'lucide-react'

export default function MembershipGuidePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">GYM29 회원권 이용 안내</h1>
        <p className="text-center text-muted-foreground">
          한화 계열사 직원을 위한 헬스장 이용 가이드
        </p>
      </div>

      {/* 회원권 종류 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            회원권 종류
          </CardTitle>
          <CardDescription>
            다양한 이용 시간대에 맞는 회원권을 선택하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">전일권</h3>
                <Badge variant="default">33,000원</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                06:00 - 23:00 자유 이용
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span>24시간 자유 이용</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">오전권</h3>
                <Badge variant="secondary">22,000원</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                06:00 - 14:00 이용
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                <Clock className="h-3 w-3" />
                <span>오전 시간대 전용</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">오후권</h3>
                <Badge variant="outline">22,000원</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                14:00 - 23:00 이용
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                <Clock className="h-3 w-3" />
                <span>오후 시간대 전용</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 이용 안내 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            이용 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">이용 시간</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 평일: 06:00 - 23:00</li>
                <li>• 주말: 08:00 - 22:00</li>
                <li>• 공휴일: 08:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">이용 대상</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 한화 계열사 직원</li>
                <li>• 계열사별 등록 필요</li>
                <li>• 사물함 이용 가능</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 시설 안내 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            시설 안내
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">헬스장 시설</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>최신 운동기구 (웨이트, 유산소)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>개인 사물함 (월 5,000원)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>샤워 시설</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>운동복 대여 서비스</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">편의 시설</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>주차장 (무료)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Wi-Fi 무료 이용</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>음료 자판기</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>운동용품 판매</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 이용 절차 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>이용 절차</CardTitle>
          <CardDescription>
            간단한 3단계로 회원권을 구매하고 이용하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold">회원권 선택</h4>
                <p className="text-sm text-muted-foreground">
                  본인의 이용 패턴에 맞는 회원권을 선택합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold">결제 및 등록</h4>
                <p className="text-sm text-muted-foreground">
                  안전한 결제 시스템을 통해 회원권을 구매합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold">헬스장 이용</h4>
                <p className="text-sm text-muted-foreground">
                  등록된 회원권으로 자유롭게 헬스장을 이용하세요.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주의사항 */}
      <Card>
        <CardHeader>
          <CardTitle>이용 시 주의사항</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-semibold">•</span>
              <span>회원권은 개인 전용이며 타인에게 양도할 수 없습니다.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-semibold">•</span>
              <span>이용 시간 외 출입 시 출입이 제한될 수 있습니다.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-semibold">•</span>
              <span>운동기구 사용 후 정리정돈을 해주세요.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-semibold">•</span>
              <span>다른 회원의 이용에 방해가 되는 행위는 금지됩니다.</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
