// AirZone 상수 정의
export const BRANDS = [
  { id: 'samsung', name: '삼성', logo: '/brands/samsung.svg' },
  { id: 'lg', name: 'LG', logo: '/brands/lg.svg' },
  { id: 'carrier', name: '캐리어', logo: '/brands/carrier.svg' },
  { id: 'daewoo', name: '대우', logo: '/brands/daewoo.svg' },
  { id: 'winia', name: '위니아', logo: '/brands/winia.svg' },
] as const

export const PRODUCT_TYPES = [
  { id: 'wall-mounted', name: '벽걸이형', icon: 'Wall' },
  { id: 'stand', name: '스탠드형', icon: 'Monitor' },
  { id: 'ceiling', name: '천장형', icon: 'Ceiling' },
  { id: 'multi', name: '멀티형', icon: 'Layers' },
] as const

export const CAPACITIES = [
  { id: '1.5', name: '1.5kW', description: '소형방 (10-15㎡)' },
  { id: '2.0', name: '2.0kW', description: '중형방 (15-20㎡)' },
  { id: '2.5', name: '2.5kW', description: '대형방 (20-25㎡)' },
  { id: '3.0', name: '3.0kW', description: '특대형방 (25-30㎡)' },
  { id: '3.5+', name: '3.5kW+', description: '매우 큰 공간 (30㎡+)' },
] as const

export const ENERGY_GRADES = [
  { id: '1', name: '1등급', color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: '2', name: '2등급', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { id: '3', name: '3등급', color: 'text-red-600', bgColor: 'bg-red-100' },
] as const

export const FEATURES = [
  { id: 'inverter', name: '인버터', icon: 'Zap' },
  { id: 'smart', name: '스마트', icon: 'Smartphone' },
  { id: 'wifi', name: 'WiFi', icon: 'Wifi' },
  { id: 'air-purifier', name: '공기청정', icon: 'Wind' },
  { id: 'auto-clean', name: '자동청소', icon: 'Sparkles' },
  { id: 'dehumidifier', name: '제습', icon: 'Droplets' },
  { id: 'heating', name: '난방', icon: 'Flame' },
] as const

export const PRICE_RANGES = [
  { id: 'under-50', name: '50만원 이하', min: 0, max: 500000 },
  { id: '50-100', name: '50-100만원', min: 500000, max: 1000000 },
  { id: '100-200', name: '100-200만원', min: 1000000, max: 2000000 },
  { id: '200-300', name: '200-300만원', min: 2000000, max: 3000000 },
  { id: 'over-300', name: '300만원 이상', min: 3000000, max: Infinity },
] as const

export const SORT_OPTIONS = [
  { id: 'popular', name: '인기순', value: 'popular' },
  { id: 'price-low', name: '가격 낮은 순', value: 'price_asc' },
  { id: 'price-high', name: '가격 높은 순', value: 'price_desc' },
  { id: 'rating', name: '평점순', value: 'rating' },
  { id: 'newest', name: '신상품순', value: 'newest' },
  { id: 'discount', name: '할인율순', value: 'discount' },
] as const

export const DELIVERY_OPTIONS = [
  { id: 'standard', name: '일반 배송', days: '3-5일', price: 0 },
  { id: 'express', name: '당일 배송', days: '당일', price: 10000 },
  { id: 'next-day', name: '내일 도착', days: '1일', price: 0 },
] as const

export const INSTALLATION_OPTIONS = [
  { id: 'basic', name: '기본 설치', price: 0, description: '기본 설치 서비스' },
  { id: 'premium', name: '프리미엄 설치', price: 50000, description: '전문 설치 서비스' },
  { id: 'diy', name: 'DIY 설치', price: -20000, description: '직접 설치 (할인)' },
] as const

export const PAYMENT_METHODS = [
  { id: 'card', name: '신용카드', icon: 'CreditCard' },
  { id: 'bank', name: '계좌이체', icon: 'Building' },
  { id: 'kakao', name: '카카오페이', icon: 'Smartphone' },
  { id: 'naver', name: '네이버페이', icon: 'Smartphone' },
  { id: 'payco', name: '페이코', icon: 'Smartphone' },
  { id: 'samsung', name: '삼성페이', icon: 'Smartphone' },
] as const

export const ORDER_STATUS = [
  { id: 'pending', name: '주문 대기', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  { id: 'confirmed', name: '주문 확인', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { id: 'preparing', name: '배송 준비', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { id: 'shipping', name: '배송 중', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  { id: 'delivered', name: '배송 완료', color: 'text-green-600', bgColor: 'bg-green-100' },
  { id: 'installed', name: '설치 완료', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
] as const

export const REVIEW_RATINGS = [
  { id: 5, name: '5점', color: 'text-green-600' },
  { id: 4, name: '4점', color: 'text-blue-600' },
  { id: 3, name: '3점', color: 'text-yellow-600' },
  { id: 2, name: '2점', color: 'text-orange-600' },
  { id: 1, name: '1점', color: 'text-red-600' },
] as const

export const CUSTOMER_SERVICE = {
  phone: '1588-0000',
  email: 'support@airzone.com',
  hours: '평일 09:00-18:00',
  chat: '실시간 채팅',
} as const

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/airzone',
  instagram: 'https://instagram.com/airzone',
  youtube: 'https://youtube.com/airzone',
  kakao: 'https://kakao.com/airzone',
} as const

// 샘플 상품 데이터
export const SAMPLE_PRODUCTS = [
  {
    id: '1',
    name: '삼성 인버터 벽걸이형 에어컨',
    brand: '삼성',
    model: 'AR12T9170HZ',
    capacity: '3.5kW',
    type: '벽걸이형',
    price: 850000,
    originalPrice: 1200000,
    discountRate: 29,
    rating: 4.8,
    reviewCount: 1247,
    image: '/api/placeholder/300/300',
    features: ['인버터', '스마트', 'WiFi', '공기청정'],
    energyGrade: '1',
    stock: 'in-stock' as const,
    delivery: '내일 도착',
    installation: '무료 설치',
    color: '화이트',
    description: '삼성의 최신 인버터 기술로 에너지 효율성과 성능을 동시에 만족하는 벽걸이형 에어컨입니다.',
  },
  {
    id: '2',
    name: 'LG 스마트 인버터 에어컨',
    brand: 'LG',
    model: 'S12MW3',
    capacity: '3.0kW',
    type: '벽걸이형',
    price: 950000,
    originalPrice: 1300000,
    discountRate: 27,
    rating: 4.7,
    reviewCount: 892,
    image: '/api/placeholder/300/300',
    features: ['인버터', '스마트', 'WiFi', '자동청소'],
    energyGrade: '1',
    stock: 'low-stock' as const,
    delivery: '내일 도착',
    installation: '무료 설치',
    color: '베이지',
    description: 'LG의 스마트 기술이 적용된 고효율 인버터 에어컨으로 편리한 사용이 가능합니다.',
  },
  {
    id: '3',
    name: '캐리어 인버터 에어컨',
    brand: '캐리어',
    model: '42QHM009DS',
    capacity: '2.5kW',
    type: '벽걸이형',
    price: 750000,
    originalPrice: 1000000,
    discountRate: 25,
    rating: 4.6,
    reviewCount: 634,
    image: '/api/placeholder/300/300',
    features: ['인버터', '제습', '난방'],
    energyGrade: '2',
    stock: 'in-stock' as const,
    delivery: '3-5일',
    installation: '무료 설치',
    color: '화이트',
    description: '캐리어의 검증된 기술로 제작된 안정적인 성능의 인버터 에어컨입니다.',
  },
  {
    id: '4',
    name: '대우 스탠드형 에어컨',
    brand: '대우',
    model: 'DW-AC3000',
    capacity: '3.0kW',
    type: '스탠드형',
    price: 650000,
    originalPrice: 850000,
    discountRate: 24,
    rating: 4.5,
    reviewCount: 456,
    image: '/api/placeholder/300/300',
    features: ['인버터', '공기청정'],
    energyGrade: '2',
    stock: 'in-stock' as const,
    delivery: '3-5일',
    installation: '무료 설치',
    color: '실버',
    description: '이동이 자유로운 스탠드형 에어컨으로 다양한 공간에서 활용 가능합니다.',
  },
  {
    id: '5',
    name: '위니아 천장형 에어컨',
    brand: '위니아',
    model: 'WC-AC2500',
    capacity: '2.5kW',
    type: '천장형',
    price: 550000,
    originalPrice: 750000,
    discountRate: 27,
    rating: 4.4,
    reviewCount: 321,
    image: '/api/placeholder/300/300',
    features: ['인버터', '제습'],
    energyGrade: '2',
    stock: 'out-of-stock' as const,
    delivery: '3-5일',
    installation: '무료 설치',
    color: '화이트',
    description: '천장에 설치하여 공간을 효율적으로 활용할 수 있는 천장형 에어컨입니다.',
  },
] as const
