# 설치 옵션 선택 컴포넌트

## 컴포넌트명: InstallOptionsSelector

### 목적
에어컨 구매 시 설치 옵션을 선택할 수 있는 컴포넌트입니다.

### Props
```typescript
interface InstallOptionsSelectorProps {
  selectedOption: 'standard' | 'none' | 'premium'
  onOptionChange: (option: 'standard' | 'none' | 'premium') => void
  className?: string
}
```

### 기능
- 표준설치 (기본, 무료)
- 설치없음 (할인 적용)
- 프리미엄 설치 (추가비용)
- 각 옵션별 가격 정보 표시
- 추가배관 길이 선택 (표준설치 선택 시)

### 사용 예시
```tsx
<InstallOptionsSelector 
  selectedOption={selectedInstall}
  onOptionChange={setSelectedInstall}
/>
```

### 디자인 요구사항
- 라디오 버튼 스타일
- 가격 정보 명확히 표시
- 추가 옵션은 조건부 표시
- 접근성 고려

