import type { ProvinceCode } from '../types/province'

export const COOKED_PROVINCE_GROUPS = {
  riceHeavy: [
    'shanghai',
    'jiangsu',
    'zhejiang',
    'anhui',
    'fujian',
    'jiangxi',
    'hubei',
    'hunan',
    'guangdong',
    'guangxi',
    'hainan',
    'chongqing',
    'sichuan',
    'guizhou',
    'yunnan',
    'xizang',
    'liaoning',
    'jilin',
    'heilongjiang'
  ] satisfies ProvinceCode[],
  mixed: [
    'tianjin',
    'shandong',
    'henan',
    'neimenggu'
  ] satisfies ProvinceCode[],
  wheatHeavy: [
    'beijing',
    'hebei',
    'shanxi',
    'shaanxi',
    'gansu',
    'qinghai',
    'ningxia',
    'xinjiang'
  ] satisfies ProvinceCode[]
} as const

export const SALT_PROVINCE_GROUPS = {
  north: [
    'beijing',
    'tianjin',
    'hebei',
    'shanxi',
    'neimenggu',
    'liaoning',
    'jilin',
    'heilongjiang',
    'shandong',
    'henan',
    'shaanxi',
    'gansu',
    'ningxia',
    'qinghai',
    'xinjiang'
  ] satisfies ProvinceCode[],
  central: [
    'shanghai',
    'jiangsu',
    'zhejiang',
    'anhui',
    'hubei',
    'chongqing',
    'sichuan'
  ] satisfies ProvinceCode[],
  south: [
    'fujian',
    'jiangxi',
    'hunan',
    'guangdong',
    'guangxi',
    'hainan',
    'guizhou',
    'yunnan',
    'xizang'
  ] satisfies ProvinceCode[]
} as const
