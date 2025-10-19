'use client'

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Youtube, MessageCircle, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CUSTOMER_SERVICE, SOCIAL_LINKS } from '@/lib/constants'

interface FooterProps {
  className?: string
  variant?: 'default' | 'minimal' | 'extended'
  showSocial?: boolean
  showNewsletter?: boolean
}

export function Footer({
  className = '',
  variant = 'default',
  showSocial = true,
  showNewsletter = true,
}: FooterProps) {
  const footerLinks = {
    company: [
      { name: '회사소개', href: '/about' },
      { name: '채용정보', href: '/careers' },
      { name: '제휴문의', href: '/partnership' },
      { name: '사업자정보', href: '/business' },
    ],
    customer: [
      { name: '고객센터', href: '/customer-service' },
      { name: 'FAQ', href: '/faq' },
      { name: 'A/S 안내', href: '/as' },
      { name: '설치 안내', href: '/installation' },
    ],
    shopping: [
      { name: '주문/배송', href: '/shipping' },
      { name: '결제 안내', href: '/payment' },
      { name: '환불 정책', href: '/refund' },
      { name: '교환 정책', href: '/exchange' },
    ],
    member: [
      { name: '회원가입', href: '/register' },
      { name: '로그인', href: '/login' },
      { name: '마이페이지', href: '/mypage' },
      { name: '주문내역', href: '/orders' },
    ],
    legal: [
      { name: '이용약관', href: '/terms' },
      { name: '개인정보처리방침', href: '/privacy' },
      { name: '청소년보호정책', href: '/youth-protection' },
      { name: '환경정책', href: '/environment' },
    ],
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: SOCIAL_LINKS.facebook },
    { name: 'Instagram', icon: Instagram, href: SOCIAL_LINKS.instagram },
    { name: 'YouTube', icon: Youtube, href: SOCIAL_LINKS.youtube },
    { name: 'Kakao', icon: MessageCircle, href: SOCIAL_LINKS.kakao },
  ]

  if (variant === 'minimal') {
    return (
      <footer className={`bg-gray-900 text-white py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AZ</span>
              </div>
              <span className="text-xl font-bold">AirZone</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 AirZone. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className={`bg-gray-900 text-white ${className}`}>
      <div className="container mx-auto px-4 py-12">
        {/* 메인 푸터 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* 회사 정보 */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AZ</span>
              </div>
              <span className="text-xl font-bold">AirZone</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              에어컨 전문 온라인 쇼핑몰<br />
              최고의 제품과 서비스를 제공합니다.
            </p>
            {showSocial && (
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* 회사 정보 */}
          <div>
            <h3 className="font-semibold mb-4">회사 정보</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 고객 서비스 */}
          <div>
            <h3 className="font-semibold mb-4">고객 서비스</h3>
            <ul className="space-y-2">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 쇼핑 정보 */}
          <div>
            <h3 className="font-semibold mb-4">쇼핑 정보</h3>
            <ul className="space-y-2">
              {footerLinks.shopping.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 회원 서비스 */}
          <div>
            <h3 className="font-semibold mb-4">회원 서비스</h3>
            <ul className="space-y-2">
              {footerLinks.member.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 고객센터 정보 */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold">고객센터</div>
                <div className="text-gray-400 text-sm">{CUSTOMER_SERVICE.phone}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold">이메일</div>
                <div className="text-gray-400 text-sm">{CUSTOMER_SERVICE.email}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-primary" />
              <div>
                <div className="font-semibold">상담시간</div>
                <div className="text-gray-400 text-sm">{CUSTOMER_SERVICE.hours}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 뉴스레터 구독 */}
        {showNewsletter && (
          <div className="border-t border-gray-800 pt-8 mb-8">
            <div className="max-w-md">
              <h3 className="font-semibold mb-2">뉴스레터 구독</h3>
              <p className="text-gray-400 text-sm mb-4">
                최신 상품 정보와 특가 소식을 받아보세요.
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 bg-gray-800 border-gray-700"
                />
                <Button>구독</Button>
              </div>
            </div>
          </div>
        )}

        {/* 하단 정보 */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 AirZone. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
