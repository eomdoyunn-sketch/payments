import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dumbbell, Wifi, Car, Shower, Lock, Coffee, MapPin, Clock } from 'lucide-react'

export default function FacilityInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">GYM29 시설 안내</h1>
        <p className="text-center text-muted-foreground">
          최신 시설과 편의 서비스를 제공하는 헬스장
        </p>
      </div>

      {/* 헬스장 시설 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            헬스장 시설
          </CardTitle>
          <CardDescription>
            최신 운동기구와 넓은 공간을 제공합니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">웨이트 트레이닝</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>프리웨이트 존 (덤벨, 바벨)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>머신 웨이트 (전신 운동)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>파워랙 (스쿼트, 벤치프레스)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>케이블 머신</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">유산소 운동</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>러닝머신 (10대)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>자전거 (8대)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>로잉머신 (4대)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>스텝퍼 (6대)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 편의 시설 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shower className="h-5 w-5" />
            편의 시설
          </CardTitle>
          <CardDescription>
            운동 전후 편리한 이용을 위한 다양한 시설
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shower className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">샤워 시설</h4>
              <p className="text-sm text-muted-foreground">
                남녀 분리 샤워실<br />
                개인 락커 제공
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">사물함</h4>
              <p className="text-sm text-muted-foreground">
                개인 사물함 대여<br />
                월 5,000원
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wifi className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Wi-Fi</h4>
              <p className="text-sm text-muted-foreground">
                무료 Wi-Fi 제공<br />
                고속 인터넷
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 위치 및 교통 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            위치 및 교통
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">주소</h4>
              <p className="text-sm text-muted-foreground mb-4">
                서울특별시 영등포구 여의대로 24<br />
                한화생명빌딩 지하 1층
              </p>
              <h4 className="font-semibold mb-3">주차</h4>
              <div className="flex items-center gap-2 mb-2">
                <Car className="h-4 w-4 text-green-600" />
                <span className="text-sm">무료 주차장 (100대 수용)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                • 지하 주차장 이용 가능<br />
                • 주차 공간이 부족할 경우 근처 공영주차장 이용
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">대중교통</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold">
                    9
                  </div>
                  <span>여의도역 1번 출구 도보 3분</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-600 text-white rounded text-xs flex items-center justify-center font-bold">
                    5
                  </div>
                  <span>여의나루역 2번 출구 도보 5분</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-600 text-white rounded text-xs flex items-center justify-center font-bold">
                    2
                  </div>
                  <span>여의도역 1번 출구 도보 3분</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 운영 시간 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            운영 시간
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">평일</h4>
              <p className="text-2xl font-bold text-primary">06:00 - 23:00</p>
              <p className="text-sm text-muted-foreground">월요일 ~ 금요일</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">주말</h4>
              <p className="text-2xl font-bold text-primary">08:00 - 22:00</p>
              <p className="text-sm text-muted-foreground">토요일, 일요일</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">공휴일</h4>
              <p className="text-2xl font-bold text-primary">08:00 - 20:00</p>
              <p className="text-sm text-muted-foreground">법정 공휴일</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 부대 시설 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            부대 시설
          </CardTitle>
          <CardDescription>
            운동 전후 편리한 이용을 위한 추가 서비스
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">음료 및 간식</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>음료 자판기 (다양한 음료)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>프로틴 쉐이크 판매</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>에너지 바 및 간식</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">운동용품</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>운동복 대여 서비스</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>운동용품 판매</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>타월 대여 서비스</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

