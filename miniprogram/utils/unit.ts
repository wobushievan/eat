import { COOKED_DISPLAY_UNITS, SALT_DISPLAY_UNITS } from '../constants/units'

export function calcCookedUnits(totalCookedFoodKg: number) {
  return {
    totalBowls: totalCookedFoodKg / (COOKED_DISPLAY_UNITS.bowlG / 1000),
    totalRiceCookers: totalCookedFoodKg / COOKED_DISPLAY_UNITS.riceCookerKg,
    totalBuckets: totalCookedFoodKg / COOKED_DISPLAY_UNITS.bucketKg,
  }
}

export function calcSaltUnits(totalSaltKg: number) {
  return {
    totalSaltBags: totalSaltKg / SALT_DISPLAY_UNITS.bagKg,
    totalSaltBoxes: totalSaltKg / SALT_DISPLAY_UNITS.boxKg,
    totalSaltSacks: totalSaltKg / SALT_DISPLAY_UNITS.sackKg,
  }
}
