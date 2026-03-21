import type { UserFormData } from '../../types/form'
import type { CalculationResult, CookedDisplay, SaltDisplay } from '../../types/result'
import { calcCookedUnits, calcSaltUnits } from '../../utils/unit'
import { getCurrentAgeYears } from './age'
import { calcStageCookedFoodKg, normalizeRatios } from './grain'
import { calcStageSaltKg } from './salt'
import { splitLifeStages } from './stages'

export function buildCookedDisplay(totalCookedFoodKg: number): CookedDisplay {
  const units = calcCookedUnits(totalCookedFoodKg)

  if (units.totalBowls < 120) {
    return {
      primaryUnit: 'bowl',
      primaryValue: units.totalBowls,
      secondaryUnit: 'kg',
      secondaryValue: totalCookedFoodKg,
    }
  }

  if (units.totalBowls < 1500) {
    return {
      primaryUnit: 'riceCooker',
      primaryValue: units.totalRiceCookers,
      secondaryUnit: 'bowl',
      secondaryValue: units.totalBowls,
    }
  }

  return {
    primaryUnit: 'bucket',
    primaryValue: units.totalBuckets,
    secondaryUnit: 'riceCooker',
    secondaryValue: units.totalRiceCookers,
  }
}

export function buildSaltDisplay(totalSaltKg: number): SaltDisplay {
  const units = calcSaltUnits(totalSaltKg)

  if (units.totalSaltBags < 40) {
    return {
      primaryUnit: 'bag',
      primaryValue: units.totalSaltBags,
      secondaryUnit: 'kg',
      secondaryValue: totalSaltKg,
    }
  }

  if (units.totalSaltBags < 200) {
    return {
      primaryUnit: 'box',
      primaryValue: units.totalSaltBoxes,
      secondaryUnit: 'bag',
      secondaryValue: units.totalSaltBags,
    }
  }

  return {
    primaryUnit: 'sack',
    primaryValue: units.totalSaltSacks,
    secondaryUnit: 'box',
    secondaryValue: units.totalSaltBoxes,
  }
}

export function calculateAll(rawFormData: UserFormData): CalculationResult {
  const normalizedRatios = normalizeRatios(rawFormData.riceRatio, rawFormData.wheatRatio, rawFormData.tuberRatio)
  const formData: UserFormData = {
    ...rawFormData,
    ...normalizedRatios,
  }

  const segments = splitLifeStages(formData.birthDate)
  let totalCookedFoodKg = 0
  let totalSaltKg = 0

  const stageBreakdown = segments.map((segment) => {
    const province = segment.ageStart < 18 ? formData.childhoodProvince : formData.adultProvince
    const cookedFoodKg = calcStageCookedFoodKg(segment.stageKey, segment.days, formData, province)
    const saltKg = calcStageSaltKg(segment.stageKey, segment.days, formData, province)

    totalCookedFoodKg += cookedFoodKg
    totalSaltKg += saltKg

    return {
      stageKey: segment.stageKey,
      days: segment.days,
      cookedFoodKg,
      saltKg,
    }
  })

  const cookedUnits = calcCookedUnits(totalCookedFoodKg)
  const saltUnits = calcSaltUnits(totalSaltKg)

  return {
    ageYears: getCurrentAgeYears(formData.birthDate),
    totalCookedFoodKg,
    totalSaltKg,
    totalBowls: cookedUnits.totalBowls,
    totalRiceCookers: cookedUnits.totalRiceCookers,
    totalBuckets: cookedUnits.totalBuckets,
    totalSaltBags: saltUnits.totalSaltBags,
    totalSaltBoxes: saltUnits.totalSaltBoxes,
    totalSaltSacks: saltUnits.totalSaltSacks,
    cookedDisplay: buildCookedDisplay(totalCookedFoodKg),
    saltDisplay: buildSaltDisplay(totalSaltKg),
    stageBreakdown,
  }
}
