# 카테고리 바로가기 섹션 컴포넌트

## 컴포넌트명: CategoryQuickAccess

### 목적
홈페이지에서 주요 에어컨 카테고리로 빠르게 이동할 수 있는 바로가기 섹션을 제공합니다.

### Props
```typescript
interface CategoryQuickAccessProps {
  className?: string
  showDescription?: boolean
}
```

### 기능
- 스탠드형, 벽걸이형, 시스템, 이동식 카테고리 바로가기
- 각 카테고리별 아이콘과 설명
- 반응형 그리드 레이아웃
- 호버 효과

### 사용 예시
```tsx
<CategoryQuickAccess showDescription={true} />
```

### 디자인 요구사항
- 카드형 레이아웃
- 아이콘과 텍스트 조합
- 호버 시 그림자 효과
- 모바일 친화적 반응형

