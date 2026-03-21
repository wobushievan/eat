import type { ProvinceCode } from './province'

export type Sex = 'male' | 'female'
export type BodyInputMode = 'exact' | 'simple'
export type BodyType = 'slim' | 'standard' | 'strong'
export type ActivityLevel = 'low' | 'medium' | 'high'
export type TasteLevel = 'light' | 'normal' | 'salty'
export type EatOutLevel = 'low' | 'medium' | 'high'

export interface UserFormData {
  birthDate: string
  sex: Sex
  bodyInputMode: BodyInputMode
  heightCm?: number
  weightKg?: number
  bodyType?: BodyType
  activityLevel: ActivityLevel
  childhoodProvince: ProvinceCode
  adultProvince: ProvinceCode
  riceRatio: number
  wheatRatio: number
  tuberRatio: number
  tasteLevel: TasteLevel
  eatOutLevel: EatOutLevel
}

export interface RatioValue {
  riceRatio: number
  wheatRatio: number
  tuberRatio: number
}
