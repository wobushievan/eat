export const SALT_BASE_G_PER_DAY = {
  '0_1': 0.5,
  '1_3': 2.0,
  '4_6': 5.0,
  '7_12': 8.5,
  '13_17': 9.5,
  '18_29': 11.2,
  '30_44': 11.0,
  '45_59': 11.0,
  '60_74': 10.5,
  '75_plus': 9.5,
} as const

export const PROVINCE_SALT_FACTOR = {
  north: 1.05,
  central: 1.0,
  south: 0.95,
} as const

export const TASTE_FACTOR_FOR_SALT = {
  light: 0.88,
  normal: 1.0,
  salty: 1.15,
} as const

export const EATOUT_FACTOR_FOR_SALT = {
  low: 0.92,
  medium: 1.0,
  high: 1.12,
} as const

export const ACTIVITY_FACTOR_FOR_SALT = {
  low: 0.98,
  medium: 1.0,
  high: 1.03,
} as const
