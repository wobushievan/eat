import { getTodayString, isValidDateString } from './date'
import type { UserFormData } from '../types/form'
import { normalizeRatios } from '../services/calc/grain'

export const DEFAULT_FORM_DATA: UserFormData = {
  birthDate: '',
  sex: 'female',
  bodyInputMode: 'simple',
  bodyType: 'standard',
  activityLevel: 'medium',
  childhoodProvince: 'guangdong',
  adultProvince: 'guangdong',
  riceRatio: 50,
  wheatRatio: 40,
  tuberRatio: 10,
  tasteLevel: 'normal',
  eatOutLevel: 'medium',
}

export function normalizeFormData(formData: UserFormData): UserFormData {
  return {
    ...formData,
    ...normalizeRatios(formData.riceRatio, formData.wheatRatio, formData.tuberRatio),
  }
}

export function validateBirthDate(value: string, today = getTodayString()): string {
  if (!value) {
    return '请选择出生日期'
  }

  if (!isValidDateString(value)) {
    return '出生日期格式不正确'
  }

  if (value < '1900-01-01') {
    return '出生日期不能早于 1900-01-01'
  }

  if (value > today) {
    return '出生日期不能晚于今天'
  }

  return ''
}

export function validateStep(step: number, formData: UserFormData, today = getTodayString()): string {
  if (step === 1) {
    return validateBirthDate(formData.birthDate, today)
  }

  if (step === 2) {
    if (formData.bodyInputMode === 'exact') {
      if (!formData.heightCm || formData.heightCm < 80 || formData.heightCm > 230) {
        return '身高范围需在 80–230 cm'
      }

      if (!formData.weightKg || formData.weightKg < 10 || formData.weightKg > 250) {
        return '体重范围需在 10–250 kg'
      }
    }

    if (formData.bodyInputMode === 'simple' && !formData.bodyType) {
      return '请选择体型档位'
    }

    if (!formData.activityLevel) {
      return '请选择长期活动强度'
    }

    return ''
  }

  if (step === 3) {
    if (!formData.childhoodProvince || !formData.adultProvince) {
      return '请选择成长省份和成年居住省份'
    }

    return ''
  }

  const normalized = normalizeRatios(formData.riceRatio, formData.wheatRatio, formData.tuberRatio)
  const total = normalized.riceRatio + normalized.wheatRatio + normalized.tuberRatio

  if (total !== 100) {
    return '主食偏好占比总和必须等于 100'
  }

  if (!formData.tasteLevel || !formData.eatOutLevel) {
    return '请选择口味和外食模式'
  }

  return ''
}
