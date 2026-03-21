import {
  ACTIVITY_FACTOR_FOR_SALT,
  EATOUT_FACTOR_FOR_SALT,
  PROVINCE_SALT_FACTOR,
  SALT_BASE_G_PER_DAY,
  TASTE_FACTOR_FOR_SALT,
} from '../../constants/salt'
import { SALT_PROVINCE_GROUPS } from '../../constants/provinceGroups'
import type { UserFormData } from '../../types/form'
import type { ProvinceCode } from '../../types/province'
import type { StageKey } from '../../types/stage'

export function getSaltProvinceGroup(province: ProvinceCode): 'north' | 'central' | 'south' {
  if ((SALT_PROVINCE_GROUPS.north as readonly ProvinceCode[]).includes(province)) {
    return 'north'
  }

  if ((SALT_PROVINCE_GROUPS.central as readonly ProvinceCode[]).includes(province)) {
    return 'central'
  }

  return 'south'
}

export function calcSaltDayG(stageKey: StageKey, formData: UserFormData, province: ProvinceCode): number {
  const provinceGroup = getSaltProvinceGroup(province)

  return (
    SALT_BASE_G_PER_DAY[stageKey] *
    PROVINCE_SALT_FACTOR[provinceGroup] *
    TASTE_FACTOR_FOR_SALT[formData.tasteLevel] *
    EATOUT_FACTOR_FOR_SALT[formData.eatOutLevel] *
    ACTIVITY_FACTOR_FOR_SALT[formData.activityLevel]
  )
}

export function calcStageSaltKg(
  stageKey: StageKey,
  days: number,
  formData: UserFormData,
  province: ProvinceCode,
): number {
  return (calcSaltDayG(stageKey, formData, province) * days) / 1000
}
