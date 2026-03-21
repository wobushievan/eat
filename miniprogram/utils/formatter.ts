import { PROVINCES } from '../constants/province'
import type { ActivityLevel, EatOutLevel, TasteLevel, UserFormData } from '../types/form'
import type { ProvinceCode } from '../types/province'
import type { CookedDisplay, SaltDisplay } from '../types/result'
import { formatDisplayValue, roundTo } from './number'

const provinceMap = new Map(PROVINCES.map((item) => [item.value, item.label]))

export function getProvinceLabel(code: ProvinceCode): string {
  return provinceMap.get(code) || code
}

export function getActivityLabel(level: ActivityLevel): string {
  return {
    low: '久坐、活动少',
    medium: '一般活动',
    high: '体力劳动 / 长期高运动量',
  }[level]
}

export function getTasteLabel(level: TasteLevel): string {
  return {
    light: '偏清淡',
    normal: '一般',
    salty: '偏咸',
  }[level]
}

export function getEatOutLabel(level: EatOutLevel): string {
  return {
    low: '外食少',
    medium: '外食中',
    high: '外食高',
  }[level]
}

export function getMainPreferenceText(formData: Pick<UserFormData, 'riceRatio' | 'wheatRatio' | 'tuberRatio'>): string {
  const pairs = [
    { label: '米饭', value: formData.riceRatio },
    { label: '面食', value: formData.wheatRatio },
    { label: '杂粮薯类', value: formData.tuberRatio },
  ].sort((a, b) => b.value - a.value)

  return `${pairs[0].label}${pairs[0].value}% / ${pairs[1].label}${pairs[1].value}% / ${pairs[2].label}${pairs[2].value}%`
}

export function buildCookedSummary(display: CookedDisplay, totalKg: number): string {
  if (display.primaryUnit === 'bowl') {
    return `截至今天，你大约已经吃了 ${formatDisplayValue(display.primaryValue)} 碗主食，约等于 ${roundTo(totalKg, 1).toFixed(1)} kg 熟主食。`
  }

  if (display.primaryUnit === 'riceCooker') {
    return `截至今天，你大约已经吃了 ${formatDisplayValue(display.primaryValue)} 个电饭煲的主食，也就是 ${formatDisplayValue(display.secondaryValue)} 碗主食。`
  }

  return `截至今天，你大约已经吃了 ${formatDisplayValue(display.primaryValue)} 个饭桶的主食，也就是 ${formatDisplayValue(display.secondaryValue)} 个电饭煲。`
}

export function buildSaltSummary(display: SaltDisplay, totalKg: number): string {
  if (display.primaryUnit === 'bag') {
    return `截至今天，你大约已经吃了 ${formatDisplayValue(display.primaryValue)} 袋家用盐，约等于 ${roundTo(totalKg, 1).toFixed(1)} kg 盐。`
  }

  if (display.primaryUnit === 'box') {
    return `截至今天，你大约已经吃了 ${formatDisplayValue(display.primaryValue)} 箱盐，也就是 ${formatDisplayValue(display.secondaryValue)} 袋家用盐。`
  }

  return `截至今天，你大约已经吃了 ${formatDisplayValue(display.primaryValue)} 麻袋盐，也就是 ${formatDisplayValue(display.secondaryValue)} 箱盐。`
}
