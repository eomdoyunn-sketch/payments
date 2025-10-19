'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, Phone, Mail, MessageCircle, HelpCircle, FileText, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/common/Header'
import { Footer } from '@/components/common/Footer'

interface FAQ {
  id: string
  category: string
  question: string
  answer: string
  helpful: number
}

interface ContactMethod {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: string
  availability: string
  responseTime: string
}

const faqCategories = [
  { id: 'order', label: '주문/결제', icon: FileText },
  { id: 'delivery', label: '배송/설치', icon: Clock },
  { id: 'service', label: 'A/S/서비스', icon: CheckCircle },
  { id: 'account', label: '회원/계정', icon: HelpCircle }
]

const mockFAQs: FAQ[] = [
  {
    id: '1',
    category: 'order',
    question: '주문을 취소하고 싶어요',
    answer: '주문 취소는 주문 완료 후 24시간 이내에 가능합니다. 마이페이지 > 주문 내역에서 취소 신청을 하실 수 있습니다.',
    helpful: 45
  },
  {
    id: '2',
    category: 'order',
    question: '결제가 실패했어요',
    answer: '결제 실패 시 다음을 확인해주세요: 1) 카드 한도 확인 2) 카드 유효기간 확인 3) CVC 번호 확인. 문제가 지속되면 고객센터로 연락주세요.',
    helpful: 32
  },
  {
    id: '3',
    category: 'delivery',
    question: '배송은 언제 되나요?',
    answer: '일반적으로 주문 후 1-2일 내에 배송됩니다. 무료 배송 기준은 30만원 이상 구매 시입니다.',
    helpful: 28
  },
  {
    id: '4',
    category: 'delivery',
    question: '설치 비용이 얼마인가요?',
    answer: '기본 설치비는 무료입니다. 단, 특수한 설치 환경(고층, 특수 벽면 등)의 경우 추가 비용이 발생할 수 있습니다.',
    helpful: 41
  },
  {
    id: '5',
    category: 'service',
    question: 'A/S는 어떻게 신청하나요?',
    answer: 'A/S 신청은 고객센터(1588-0000) 또는 온라인으로 신청 가능합니다. 제품 보증 기간 내 무료 A/S가 제공됩니다.',
    helpful: 37
  },
  {
    id: '6',
    category: 'account',
    question: '비밀번호를 잊어버렸어요',
    answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하여 휴대폰 인증 또는 이메일 인증으로 새 비밀번호를 설정할 수 있습니다.',
    helpful: 23
  }
]

const contactMethods: ContactMethod[] = [
  {
    id: 'chat',
    title: '실시간 채팅',
    description: '온라인 상담사와 실시간 채팅',
    icon: MessageCircle,
    action: '채팅 시작',
    availability: '평일 09:00-18:00',
    responseTime: '즉시 응답'
  },
  {
    id: 'phone',
    title: '전화 상담',
    description: '고객센터 전화 상담',
    icon: Phone,
    action: '1588-0000',
    availability: '평일 09:00-18:00',
    responseTime: '평균 2분'
  },
  {
    id: 'email',
    title: '이메일 문의',
    description: '이메일로 문의사항 전송',
    icon: Mail,
    action: '문의하기',
    availability: '24시간',
    responseTime: '24시간 이내'
  }
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleFAQClick = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const handleHelpfulClick = (faqId: string) => {
    // 실제로는 API 호출로 도움됨 수 증가
    console.log(`FAQ ${faqId} 도움됨 클릭`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">고객 서비스</h1>
          <p className="text-gray-600">궁금한 점이 있으시면 언제든 문의해주세요</p>
        </div>

        {/* 빠른 문의 방법 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {contactMethods.map((method) => (
            <Card key={method.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{method.description}</p>
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div>운영시간: {method.availability}</div>
                  <div>응답시간: {method.responseTime}</div>
                </div>
                <Button className="w-full">
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ 섹션 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    자주 묻는 질문
                  </CardTitle>
                  <Badge variant="outline">
                    {filteredFAQs.length}개 질문
                  </Badge>
                </div>
                
                {/* 검색 및 필터 */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="궁금한 내용을 검색해보세요"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                    >
                      전체
                    </Button>
                    {faqCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center gap-2"
                      >
                        <category.icon className="w-4 h-4" />
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">검색 결과가 없습니다</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq) => (
                    <div key={faq.id} className="border rounded-lg">
                      <button
                        onClick={() => handleFAQClick(faq.id)}
                        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{faq.question}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {faqCategories.find(cat => cat.id === faq.category)?.label}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {expandedFAQ === faq.id ? '접기' : '펼치기'}
                            </span>
                          </div>
                        </div>
                      </button>
                      
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4 border-t bg-gray-50">
                          <div className="pt-4">
                            <p className="text-gray-700 mb-4">{faq.answer}</p>
                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleHelpfulClick(faq.id)}
                                className="flex items-center gap-2"
                              >
                                <Star className="w-4 h-4" />
                                도움됨 ({faq.helpful})
                              </Button>
                              <Button variant="ghost" size="sm">
                                답변 공유
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 인기 문의 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">인기 문의</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockFAQs
                  .sort((a, b) => b.helpful - a.helpful)
                  .slice(0, 5)
                  .map((faq) => (
                    <div key={faq.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {faq.question}
                        </p>
                        <p className="text-xs text-gray-500">
                          도움됨 {faq.helpful}명
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* 고객센터 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">고객센터 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">1588-0000</p>
                    <p className="text-sm text-gray-600">평일 09:00-18:00</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">support@airzone.com</p>
                    <p className="text-sm text-gray-600">24시간 접수</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">실시간 채팅</p>
                    <p className="text-sm text-gray-600">평일 09:00-18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 서비스 안내 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">서비스 안내</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">무료 배송 (30만원 이상)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">무료 설치 서비스</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">전국 A/S 지원</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">1년 무상 보증</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
