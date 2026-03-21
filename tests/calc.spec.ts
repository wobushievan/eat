import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calcCookedFoodDayG, getCookedMixFactor, resolveBodyType } from '../miniprogram/services/calc/grain'
import { buildCookedDisplay, buildSaltDisplay, calculateAll } from '../miniprogram/services/calc/result'
import { calcSaltDayG } from '../miniprogram/services/calc/salt'
import { splitLifeStages } from '../miniprogram/services/calc/stages'
import type { UserFormData } from '../miniprogram/types/form'

const baseForm: UserFormData = {
  birthDate: '2001-03-21',
  sex: 'female',
  bodyInputMode: 'simple',
  bodyType: 'standard',
  activityLevel: 'medium',
  childhoodProvince: 'guangdong',
  adultProvince: 'guangdong',
  riceRatio: 60,
  wheatRatio: 30,
  tuberRatio: 10,
  tasteLevel: 'normal',
  eatOutLevel: 'medium',
}

describe('life stages', () => {
  it('splits stages by exact dates and includes birth day', () => {
    const result = splitLifeStages('2024-02-29', '2026-03-01')

    expect(result).toEqual([
      {
        stageKey: '0_1',
        startDate: '2024-02-29',
        endDate: '2025-02-27',
        days: 365,
        ageStart: 0,
        ageEnd: 1,
      },
      {
        stageKey: '1_3',
        startDate: '2025-02-28',
        endDate: '2026-03-01',
        days: 367,
        ageStart: 1,
        ageEnd: 3,
      },
    ])
  })
})

describe('body type and mix factor', () => {
  it('maps BMI to body type', () => {
    expect(resolveBodyType({ bodyInputMode: 'exact', heightCm: 170, weightKg: 50 })).toBe('slim')
    expect(resolveBodyType({ bodyInputMode: 'exact', heightCm: 170, weightKg: 65 })).toBe('standard')
    expect(resolveBodyType({ bodyInputMode: 'exact', heightCm: 170, weightKg: 75 })).toBe('strong')
  })

  it('calculates cooked mix factor from ratios', () => {
    expect(getCookedMixFactor(baseForm)).toBeCloseTo(2.3, 5)
  })
})

describe('daily calculations', () => {
  it('calculates cooked food day grams', () => {
    const value = calcCookedFoodDayG('18_29', baseForm, 'guangdong')
    expect(value).toBeCloseTo(645.7894, 4)
  })

  it('calculates salt day grams', () => {
    const value = calcSaltDayG('18_29', baseForm, 'guangdong')
    expect(value).toBeCloseTo(10.64, 2)
  })
})

describe('display unit switching', () => {
  it('switches cooked units by bowl thresholds', () => {
    expect(buildCookedDisplay(10).primaryUnit).toBe('bowl')
    expect(buildCookedDisplay(30).primaryUnit).toBe('riceCooker')
    expect(buildCookedDisplay(240).primaryUnit).toBe('bucket')
  })

  it('switches salt units by bag thresholds', () => {
    expect(buildSaltDisplay(10).primaryUnit).toBe('bag')
    expect(buildSaltDisplay(30).primaryUnit).toBe('box')
    expect(buildSaltDisplay(120).primaryUnit).toBe('sack')
  })
})

describe('result aggregation cases', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-21T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('case 1: 25岁女性结果落在预期展示区间', () => {
    const result = calculateAll(baseForm)

    expect(['riceCooker', 'bucket']).toContain(result.cookedDisplay.primaryUnit)
    expect(result.saltDisplay.primaryUnit).toBe('box')
  })

  it('case 2: 35岁男性偏壮高活动结果高于用例1', () => {
    const case1 = calculateAll(baseForm)
    const case2 = calculateAll({
      ...baseForm,
      birthDate: '1991-03-21',
      sex: 'male',
      bodyType: 'strong',
      childhoodProvince: 'beijing',
      adultProvince: 'beijing',
      riceRatio: 20,
      wheatRatio: 70,
      tuberRatio: 10,
      activityLevel: 'high',
      tasteLevel: 'salty',
      eatOutLevel: 'high',
    })

    expect(case2.totalCookedFoodKg).toBeGreaterThan(case1.totalCookedFoodKg)
    expect(case2.totalSaltKg).toBeGreaterThan(case1.totalSaltKg)
  })

  it('case 3: 8岁儿童结果总量明显小于成年人，盐保持较低', () => {
    const child = calculateAll({
      ...baseForm,
      birthDate: '2018-03-21',
    })

    expect(child.totalCookedFoodKg).toBeLessThan(calculateAll(baseForm).totalCookedFoodKg)
    expect(child.totalSaltKg).toBeLessThan(40)
  })

  it('case 4: 70岁用户累计结果明显高于25岁用户', () => {
    const case1 = calculateAll(baseForm)
    const senior = calculateAll({
      ...baseForm,
      birthDate: '1956-03-21',
      sex: 'male',
      bodyType: 'standard',
    })

    expect(senior.totalCookedFoodKg).toBeGreaterThan(case1.totalCookedFoodKg)
    expect(senior.totalSaltKg).toBeGreaterThan(case1.totalSaltKg)
    expect(['bucket', 'riceCooker']).toContain(senior.cookedDisplay.primaryUnit)
  })
})
