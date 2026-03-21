export type ProvinceCode =
  | 'beijing'
  | 'tianjin'
  | 'shanghai'
  | 'chongqing'
  | 'hebei'
  | 'shanxi'
  | 'liaoning'
  | 'jilin'
  | 'heilongjiang'
  | 'jiangsu'
  | 'zhejiang'
  | 'anhui'
  | 'fujian'
  | 'jiangxi'
  | 'shandong'
  | 'henan'
  | 'hubei'
  | 'hunan'
  | 'guangdong'
  | 'hainan'
  | 'sichuan'
  | 'guizhou'
  | 'yunnan'
  | 'shaanxi'
  | 'gansu'
  | 'qinghai'
  | 'neimenggu'
  | 'guangxi'
  | 'xizang'
  | 'ningxia'
  | 'xinjiang'

export interface ProvinceOption {
  label: string
  value: ProvinceCode
  pinyin: string
  sortOrder: number
}
