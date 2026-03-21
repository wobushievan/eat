export const GRAIN_BASE_G_PER_DAY = {
  '0_1': 27,
  '1_3': 88,
  '4_6': 144,
  '7_12': 203,
  '13_17': 281,
  '18_29': 290,
  '30_44': 285,
  '45_59': 280,
  '60_74': 260,
  '75_plus': 235,
} as const

export const SEX_FACTOR_FOR_GRAIN = {
  under13: 1.0,
  male13Plus: 1.06,
  female13Plus: 0.94,
} as const

export const BODY_FACTOR_FOR_GRAIN = {
  slim: 0.93,
  standard: 1.0,
  strong: 1.1,
} as const

export const ACTIVITY_FACTOR_FOR_GRAIN = {
  low: 0.92,
  medium: 1.0,
  high: 1.12,
} as const

export const COOKED_MULTIPLIER = {
  rice: 2.6,
  wheat: 2.0,
  tuber: 1.4,
} as const

export const PROVINCE_COOKED_FACTOR = {
  riceHeavy: 1.03,
  mixed: 1.0,
  wheatHeavy: 0.97,
} as const
