'use client'

import React, { useState, use } from 'react'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'
import { ProductCard } from '@/components/common/ProductCard'
import { ImageGallery } from '@/components/common/ImageGallery'
import { ProductComparison } from '@/components/common/ProductComparison'
import { InstallCostBlock } from '@/components/common/InstallCostBlock'
import { InstallOptionsSelector } from '@/components/common/InstallOptionsSelector'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  Truck, 
  Wrench, 
  Shield,
  Zap,
  Wind,
  Flame,
  Volume2,
  Smartphone,
  Wifi,
  Sparkles,
  Droplets,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Scale
} from 'lucide-react'
import { SAMPLE_PRODUCTS } from '@/lib/constants'
import Link from 'next/link'

interface ProductDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params)
  const product = SAMPLE_PRODUCTS.find(p => p.id === resolvedParams.id)
  
  const [selectedColor, setSelectedColor] = useState('화이트')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('specs')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([resolvedParams.id])
  const [selectedInstallOption, setSelectedInstallOption] = useState<'standard' | 'none' | 'premium'>('standard')
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
          <Link href="/products">
            <Button>상품 목록으로 돌아가기</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const toggleProductComparison = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else if (selectedProducts.length < 4) {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const clearComparison = () => {
    setSelectedProducts([])
  }

  const relatedProducts = SAMPLE_PRODUCTS
    .filter(p => p.id !== product.id && p.brand === product.brand)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            상품 목록으로 돌아가기
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* 상품 이미지 - 좌측 1/3 */}
          <div className="xl:col-span-1">
            <ImageGallery 
              images={[product.image, product.image, product.image, product.image]} 
              productName={product.name}
            />
          </div>

          {/* 상품 정보 - 우측 2/3 */}
          <div className="xl:col-span-2 space-y-6">
            {/* 상품 기본 정보 */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="text-sm text-gray-500 mb-2">{product.brand}</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount.toLocaleString()}개 리뷰)
                  </span>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className="space-y-3">
                {product.originalPrice && (
                  <div className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}원
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(product.price)}원
                  </div>
                  {product.discountRate && (
                    <Badge variant="destructive" className="text-lg px-3 py-1">
                      {product.discountRate}% 할인
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  월 {formatPrice(Math.floor(product.price / 12))}원 (12개월 할부)
                </div>
              </div>
            </div>

            {/* 배송/설치 정보 */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">배송/설치 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>{product.delivery}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>{product.installation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>1년 무상 보증</span>
                </div>
              </div>
            </div>

            {/* 옵션 선택 */}
            <div className="bg-white p-6 rounded-lg border space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">옵션 선택</h3>
              
              <div>
                <h4 className="font-medium mb-3">색상</h4>
                <div className="flex gap-2">
                  {['화이트', '베이지', '실버', '블랙'].map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className="min-w-[80px]"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">수량</h4>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-20 text-center"
                    min="1"
                    max="5"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                    disabled={quantity >= 5}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            {/* 설치 옵션 선택 */}
            <div className="bg-white p-6 rounded-lg border">
              <InstallOptionsSelector
                selectedOption={selectedInstallOption}
                onOptionChange={setSelectedInstallOption}
              />
            </div>

            {/* 구매 버튼 */}
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex gap-4 mb-4">
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  관심상품
                </Button>
                <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  장바구니 담기
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  공유하기
                </Button>
                <ProductComparison
                  selectedProducts={selectedProducts}
                  onToggleProduct={toggleProductComparison}
                  onClearComparison={clearComparison}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 탭 */}
        <div className="mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 max-w-4xl mx-auto">
              <TabsTrigger value="specs">상세 스펙</TabsTrigger>
              <TabsTrigger value="reviews">리뷰</TabsTrigger>
              <TabsTrigger value="qna">Q&A</TabsTrigger>
              <TabsTrigger value="shipping">배송/교환</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-6">
              <div className="max-w-6xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>상세 스펙</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">기본 정보</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">브랜드</span>
                          <span>{product.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">모델명</span>
                          <span>{product.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">용량</span>
                          <span>{product.capacity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">타입</span>
                          <span>{product.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">에너지등급</span>
                          <Badge variant="outline">{product.energyGrade}등급</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">주요 기능</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">성능 스펙</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Wind className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="font-semibold">냉방 능력</div>
                        <div className="text-sm text-gray-600">{product.capacity}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="font-semibold">에너지 효율</div>
                        <div className="text-sm text-gray-600">{product.energyGrade}등급</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Volume2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="font-semibold">소음 수준</div>
                        <div className="text-sm text-gray-600">19dB</div>
                      </div>
                    </div>
                  </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="max-w-6xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>고객 리뷰</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">리뷰가 아직 없습니다</div>
                      <Button variant="outline">첫 리뷰 작성하기</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="qna" className="mt-6">
              <div className="max-w-6xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Q&A</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-gray-500 mb-4">문의가 아직 없습니다</div>
                      <Button variant="outline">문의하기</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="max-w-6xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>배송/교환 안내</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">배송 안내</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 전국 무료 배송 (30만원 이상 구매 시)</li>
                        <li>• 일반 배송: 3-5일 소요</li>
                        <li>• 당일 배송: 추가 비용 1만원</li>
                        <li>• 설치 서비스 포함</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">교환/반품 안내</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 7일 이내 무료 교환/반품</li>
                        <li>• 설치 완료 후 7일 이내</li>
                        <li>• 상품 하자 시 무료 교환</li>
                        <li>• 고객 변심 시 배송비 고객 부담</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* 설치비/추가비 고지 블록 */}
                <InstallCostBlock />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 관련 상품 */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">관련 상품</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="relative">
                  <ProductCard
                    product={relatedProduct}
                  />
                  <div className="absolute top-2 left-2">
                    <Button
                      variant={selectedProducts.includes(relatedProduct.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleProductComparison(relatedProduct.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Scale className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}