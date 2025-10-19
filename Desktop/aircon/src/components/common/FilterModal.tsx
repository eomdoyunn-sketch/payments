'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SlidersHorizontal, X } from 'lucide-react'
import { BRANDS, CAPACITIES, ENERGY_GRADES, FEATURES } from '@/lib/constants'

interface FilterModalProps {
  selectedBrands: string[]
  selectedCapacities: string[]
  selectedEnergyGrades: string[]
  selectedFeatures: string[]
  priceRange: [number, number]
  onBrandsChange: (brands: string[]) => void
  onCapacitiesChange: (capacities: string[]) => void
  onEnergyGradesChange: (grades: string[]) => void
  onFeaturesChange: (features: string[]) => void
  onPriceRangeChange: (range: [number, number]) => void
  onApplyFilters: () => void
  onClearFilters: () => void
}

export function FilterModal({
  selectedBrands,
  selectedCapacities,
  selectedEnergyGrades,
  selectedFeatures,
  priceRange,
  onBrandsChange,
  onCapacitiesChange,
  onEnergyGradesChange,
  onFeaturesChange,
  onPriceRangeChange,
  onApplyFilters,
  onClearFilters
}: FilterModalProps) {
  const [open, setOpen] = React.useState(false)

  const handleBrandToggle = (brandName: string) => {
    const newBrands = selectedBrands.includes(brandName)
      ? selectedBrands.filter(name => name !== brandName)
      : [...selectedBrands, brandName]
    onBrandsChange(newBrands)
  }

  const handleCapacityToggle = (capacityName: string) => {
    const newCapacities = selectedCapacities.includes(capacityName)
      ? selectedCapacities.filter(name => name !== capacityName)
      : [...selectedCapacities, capacityName]
    onCapacitiesChange(newCapacities)
  }

  const handleEnergyGradeToggle = (gradeId: string) => {
    const newGrades = selectedEnergyGrades.includes(gradeId)
      ? selectedEnergyGrades.filter(id => id !== gradeId)
      : [...selectedEnergyGrades, gradeId]
    onEnergyGradesChange(newGrades)
  }

  const handleFeatureToggle = (featureName: string) => {
    const newFeatures = selectedFeatures.includes(featureName)
      ? selectedFeatures.filter(name => name !== featureName)
      : [...selectedFeatures, featureName]
    onFeaturesChange(newFeatures)
  }

  const handleApply = () => {
    onApplyFilters()
    setOpen(false)
  }

  const getActiveFilterCount = () => {
    return selectedBrands.length + selectedCapacities.length + selectedEnergyGrades.length + selectedFeatures.length
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          필터
          {getActiveFilterCount() > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>상품 필터</span>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              초기화
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 브랜드 필터 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">브랜드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {BRANDS.map((brand) => (
                <div key={brand.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.id}`}
                    checked={selectedBrands.includes(brand.name)}
                    onCheckedChange={() => handleBrandToggle(brand.name)}
                  />
                  <label htmlFor={`brand-${brand.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {brand.name}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 용량 필터 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">용량</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {CAPACITIES.map((capacity) => (
                <div key={capacity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`capacity-${capacity.id}`}
                    checked={selectedCapacities.includes(capacity.name)}
                    onCheckedChange={() => handleCapacityToggle(capacity.name)}
                  />
                  <label htmlFor={`capacity-${capacity.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    <div>{capacity.name}</div>
                    <div className="text-xs text-gray-500">{capacity.description}</div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 에너지등급 필터 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">에너지등급</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ENERGY_GRADES.map((grade) => (
                <div key={grade.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grade-${grade.id}`}
                    checked={selectedEnergyGrades.includes(grade.id)}
                    onCheckedChange={() => handleEnergyGradeToggle(grade.id)}
                  />
                  <label htmlFor={`grade-${grade.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {grade.name}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 기능 필터 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">주요 기능</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {FEATURES.map((feature) => (
                <div key={feature.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature.id}`}
                    checked={selectedFeatures.includes(feature.name)}
                    onCheckedChange={() => handleFeatureToggle(feature.name)}
                  />
                  <label htmlFor={`feature-${feature.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {feature.name}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button onClick={handleApply}>
            필터 적용
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
