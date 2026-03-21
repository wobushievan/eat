export const SEX_OPTIONS = [
  { label: '男性', value: 'male' },
  { label: '女性', value: 'female' },
] as const

export const BODY_INPUT_MODE_OPTIONS = [
  { label: '精确身高体重', value: 'exact' },
  { label: '直接选体型', value: 'simple' },
] as const

export const BODY_TYPE_OPTIONS = [
  { label: '偏瘦', value: 'slim' },
  { label: '标准', value: 'standard' },
  { label: '偏壮', value: 'strong' },
] as const

export const ACTIVITY_OPTIONS = [
  { label: '活动少', value: 'low', description: '久坐、活动少' },
  { label: '一般活动', value: 'medium', description: '日常活动为主' },
  { label: '高活动', value: 'high', description: '体力劳动 / 长期高运动量' },
] as const

export const TASTE_OPTIONS = [
  { label: '清淡', value: 'light' },
  { label: '一般', value: 'normal' },
  { label: '偏咸', value: 'salty' },
] as const

export const EATOUT_OPTIONS = [
  { label: '外食少', value: 'low' },
  { label: '中等', value: 'medium' },
  { label: '偏高', value: 'high' },
] as const
