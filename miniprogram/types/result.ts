import type { StageBreakdownItem } from './stage'

export interface CookedDisplay {
  primaryUnit: 'bowl' | 'riceCooker' | 'bucket'
  primaryValue: number
  secondaryUnit: 'kg' | 'bowl' | 'riceCooker'
  secondaryValue: number
}

export interface SaltDisplay {
  primaryUnit: 'bag' | 'box' | 'sack'
  primaryValue: number
  secondaryUnit: 'kg' | 'bag' | 'box'
  secondaryValue: number
}

export interface CalculationResult {
  ageYears: number
  totalCookedFoodKg: number
  totalSaltKg: number
  totalBowls: number
  totalRiceCookers: number
  totalBuckets: number
  totalSaltBags: number
  totalSaltBoxes: number
  totalSaltSacks: number
  cookedDisplay: CookedDisplay
  saltDisplay: SaltDisplay
  stageBreakdown: StageBreakdownItem[]
}
