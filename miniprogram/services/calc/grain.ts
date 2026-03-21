import {
  ACTIVITY_FACTOR_FOR_GRAIN,
  BODY_FACTOR_FOR_GRAIN,
  COOKED_MULTIPLIER,
  GRAIN_BASE_G_PER_DAY,
  PROVINCE_COOKED_FACTOR,
  SEX_FACTOR_FOR_GRAIN,
} from '../../constants/grain'
import { COOKED_PROVINCE_GROUPS } from '../../constants/provinceGroups'
import type { BodyType, UserFormData } from '../../types/form'
import type { ProvinceCode } from '../../types/province'
import type { StageKey } from '../../types/stage'
import { clamp } from '../../utils/number'

export function resolveBodyType(formData: Pick<UserFormData, 'bodyInputMode' | 'bodyType' | 'heightCm' | 'weightKg'>): BodyType {
  if (formData.bodyInputMode === 'simple') {
    return formData.bodyType || 'standard'
  }

  const heightCm = formData.heightCm || 0
  const weightKg = formData.weightKg || 0
  const heightM = heightCm / 100
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0

  if (bmi < 18.5) {
    return 'slim'
  }

  if (bmi < 24) {
    return 'standard'
  }

  return 'strong'
}

export function normalizeRatios(riceRatio: number, wheatRatio: number, tuberRatio: number) {
  const values = [riceRatio, wheatRatio, tuberRatio].map((value) => clamp(Math.round(value), 0, 100))
  const total = values.reduce((sum, value) => sum + value, 0)

  if (total === 100) {
    return {
      riceRatio: values[0],
      wheatRatio: values[1],
      tuberRatio: values[2],
    }
  }

  if (total === 0) {
    return { riceRatio: 50, wheatRatio: 40, tuberRatio: 10 }
  }

  const scaled = values.map((value) => Math.round((value / total) * 100))
  const diff = 100 - scaled.reduce((sum, value) => sum + value, 0)
  scaled[0] += diff

  return {
    riceRatio: scaled[0],
    wheatRatio: scaled[1],
    tuberRatio: scaled[2],
  }
}

export function getCookedProvinceGroup(province: ProvinceCode): 'riceHeavy' | 'mixed' | 'wheatHeavy' {
  if ((COOKED_PROVINCE_GROUPS.riceHeavy as readonly ProvinceCode[]).includes(province)) {
    return 'riceHeavy'
  }

  if ((COOKED_PROVINCE_GROUPS.mixed as readonly ProvinceCode[]).includes(province)) {
    return 'mixed'
  }

  return 'wheatHeavy'
}

export function getCookedMixFactor(formData: Pick<UserFormData, 'riceRatio' | 'wheatRatio' | 'tuberRatio'>): number {
  const normalized = normalizeRatios(formData.riceRatio, formData.wheatRatio, formData.tuberRatio)
  return (
    (normalized.riceRatio / 100) * COOKED_MULTIPLIER.rice +
    (normalized.wheatRatio / 100) * COOKED_MULTIPLIER.wheat +
    (normalized.tuberRatio / 100) * COOKED_MULTIPLIER.tuber
  )
}

export function getSexFactorForGrain(stageKey: StageKey, sex: UserFormData['sex']): number {
  if (stageKey === '0_1' || stageKey === '1_3' || stageKey === '4_6' || stageKey === '7_12') {
    return SEX_FACTOR_FOR_GRAIN.under13
  }

  return sex === 'male' ? SEX_FACTOR_FOR_GRAIN.male13Plus : SEX_FACTOR_FOR_GRAIN.female13Plus
}

export function calcCookedFoodDayG(
  stageKey: StageKey,
  formData: UserFormData,
  province: ProvinceCode,
): number {
  const bodyType = resolveBodyType(formData)
  const provinceGroup = getCookedProvinceGroup(province)
  const cookedMixFactor = getCookedMixFactor(formData)

  return (
    GRAIN_BASE_G_PER_DAY[stageKey] *
    getSexFactorForGrain(stageKey, formData.sex) *
    BODY_FACTOR_FOR_GRAIN[bodyType] *
    ACTIVITY_FACTOR_FOR_GRAIN[formData.activityLevel] *
    cookedMixFactor *
    PROVINCE_COOKED_FACTOR[provinceGroup]
  )
}

export function calcStageCookedFoodKg(
  stageKey: StageKey,
  days: number,
  formData: UserFormData,
  province: ProvinceCode,
): number {
  return (calcCookedFoodDayG(stageKey, formData, province) * days) / 1000
}
