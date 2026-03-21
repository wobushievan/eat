const STAGE_SEQUENCE = ['0_1', '1_3', '4_6', '7_12', '13_17', '18_29', '30_44', '45_59', '60_74', '75_plus']

const STAGE_AGE_BOUNDARIES = {
  '0_1': { startAge: 0, endAgeExclusive: 1, labelAgeEnd: 1 },
  '1_3': { startAge: 1, endAgeExclusive: 4, labelAgeEnd: 3 },
  '4_6': { startAge: 4, endAgeExclusive: 7, labelAgeEnd: 6 },
  '7_12': { startAge: 7, endAgeExclusive: 13, labelAgeEnd: 12 },
  '13_17': { startAge: 13, endAgeExclusive: 18, labelAgeEnd: 17 },
  '18_29': { startAge: 18, endAgeExclusive: 30, labelAgeEnd: 29 },
  '30_44': { startAge: 30, endAgeExclusive: 45, labelAgeEnd: 44 },
  '45_59': { startAge: 45, endAgeExclusive: 60, labelAgeEnd: 59 },
  '60_74': { startAge: 60, endAgeExclusive: 75, labelAgeEnd: 74 },
  '75_plus': { startAge: 75, endAgeExclusive: null, labelAgeEnd: 75 },
}

const GRAIN_BASE_G_PER_DAY = {
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
}

const SALT_BASE_G_PER_DAY = {
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
}

const COOKED_MULTIPLIER = { rice: 2.6, wheat: 2.0, tuber: 1.4 }
const BODY_FACTOR_FOR_GRAIN = { slim: 0.93, standard: 1.0, strong: 1.1 }
const ACTIVITY_FACTOR_FOR_GRAIN = { low: 0.92, medium: 1.0, high: 1.12 }
const ACTIVITY_FACTOR_FOR_SALT = { low: 0.98, medium: 1.0, high: 1.03 }
const TASTE_FACTOR_FOR_SALT = { light: 0.88, normal: 1.0, salty: 1.15 }
const EATOUT_FACTOR_FOR_SALT = { low: 0.92, medium: 1.0, high: 1.12 }
const PROVINCE_COOKED_FACTOR = { riceHeavy: 1.03, mixed: 1.0, wheatHeavy: 0.97 }
const PROVINCE_SALT_FACTOR = { north: 1.05, central: 1.0, south: 0.95 }
const COOKED_DISPLAY_UNITS = { bowlG: 150, riceCookerKg: 1.5, bucketKg: 30 }
const SALT_DISPLAY_UNITS = { bagKg: 0.5, boxKg: 10, sackKg: 25 }

const COOKED_PROVINCE_GROUPS = {
  riceHeavy: ['shanghai', 'jiangsu', 'zhejiang', 'anhui', 'fujian', 'jiangxi', 'hubei', 'hunan', 'guangdong', 'guangxi', 'hainan', 'chongqing', 'sichuan', 'guizhou', 'yunnan', 'xizang', 'liaoning', 'jilin', 'heilongjiang'],
  mixed: ['tianjin', 'shandong', 'henan', 'neimenggu'],
  wheatHeavy: ['beijing', 'hebei', 'shanxi', 'shaanxi', 'gansu', 'qinghai', 'ningxia', 'xinjiang'],
}

const SALT_PROVINCE_GROUPS = {
  north: ['beijing', 'tianjin', 'hebei', 'shanxi', 'neimenggu', 'liaoning', 'jilin', 'heilongjiang', 'shandong', 'henan', 'shaanxi', 'gansu', 'ningxia', 'qinghai', 'xinjiang'],
  central: ['shanghai', 'jiangsu', 'zhejiang', 'anhui', 'hubei', 'chongqing', 'sichuan'],
  south: ['fujian', 'jiangxi', 'hunan', 'guangdong', 'guangxi', 'hainan', 'guizhou', 'yunnan', 'xizang'],
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)) }
function parseDateString(dateStr) { const p = dateStr.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])) }
function formatDateString(date) { return `${date.getUTCFullYear()}-${`${date.getUTCMonth() + 1}`.padStart(2, '0')}-${`${date.getUTCDate()}`.padStart(2, '0')}` }
function addDays(dateStr, days) { const d = parseDateString(dateStr); return formatDateString(new Date(d.getTime() + days * 86400000)) }
function addYears(dateStr, years) { const d = parseDateString(dateStr); const y = d.getUTCFullYear() + years; const m = d.getUTCMonth(); const day = d.getUTCDate(); const t = new Date(Date.UTC(y, m, day)); return t.getUTCMonth() !== m ? formatDateString(new Date(Date.UTC(y, m + 1, 0))) : formatDateString(t) }
function diffDays(startDate, endDateExclusive) { return Math.max(0, Math.round((parseDateString(endDateExclusive).getTime() - parseDateString(startDate).getTime()) / 86400000)) }
function compareDate(a, b) { return parseDateString(a).getTime() - parseDateString(b).getTime() }
function minDate(a, b) { return compareDate(a, b) <= 0 ? a : b }
function maxDate(a, b) { return compareDate(a, b) >= 0 ? a : b }
function getTodayString() { const n = new Date(); return formatDateString(new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()))) }

function getCurrentAgeYears(birthDate, today = getTodayString()) {
  const birth = parseDateString(birthDate)
  const current = parseDateString(today)
  let age = current.getUTCFullYear() - birth.getUTCFullYear()
  const monthDiff = current.getUTCMonth() - birth.getUTCMonth()
  const dayDiff = current.getUTCDate() - birth.getUTCDate()
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age -= 1
  return Math.max(age, 0)
}

function splitLifeStages(birthDate, today = getTodayString()) {
  if (compareDate(birthDate, today) > 0) return []
  const lifeEndExclusive = addDays(today, 1)
  const currentAge = getCurrentAgeYears(birthDate, today)
  return STAGE_SEQUENCE.reduce((segments, stageKey) => {
    const config = STAGE_AGE_BOUNDARIES[stageKey]
    const stageStart = addYears(birthDate, config.startAge)
    const stageEndExclusive = config.endAgeExclusive === null ? lifeEndExclusive : addYears(birthDate, config.endAgeExclusive)
    const overlapStart = maxDate(stageStart, birthDate)
    const overlapEndExclusive = minDate(stageEndExclusive, lifeEndExclusive)
    const days = diffDays(overlapStart, overlapEndExclusive)
    if (days <= 0 || compareDate(overlapStart, overlapEndExclusive) >= 0) return segments
    segments.push({ stageKey, startDate: overlapStart, endDate: addDays(overlapEndExclusive, -1), days, ageStart: config.startAge, ageEnd: stageKey === '75_plus' ? Math.max(currentAge, 75) : config.labelAgeEnd })
    return segments
  }, [])
}

function resolveBodyType(formData) {
  if (formData.bodyInputMode === 'simple') return formData.bodyType || 'standard'
  const heightCm = formData.heightCm || 0
  const weightKg = formData.weightKg || 0
  const heightM = heightCm / 100
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0
  if (bmi < 18.5) return 'slim'
  if (bmi < 24) return 'standard'
  return 'strong'
}

function normalizeRatios(riceRatio, wheatRatio, tuberRatio) {
  const values = [riceRatio, wheatRatio, tuberRatio].map((v) => clamp(Math.round(v), 0, 100))
  const total = values[0] + values[1] + values[2]
  if (total === 100) return { riceRatio: values[0], wheatRatio: values[1], tuberRatio: values[2] }
  if (total === 0) return { riceRatio: 50, wheatRatio: 40, tuberRatio: 10 }
  const scaled = values.map((v) => Math.round((v / total) * 100))
  scaled[0] += 100 - (scaled[0] + scaled[1] + scaled[2])
  return { riceRatio: scaled[0], wheatRatio: scaled[1], tuberRatio: scaled[2] }
}

function getCookedProvinceGroup(province) { if (COOKED_PROVINCE_GROUPS.riceHeavy.includes(province)) return 'riceHeavy'; if (COOKED_PROVINCE_GROUPS.mixed.includes(province)) return 'mixed'; return 'wheatHeavy' }
function getSaltProvinceGroup(province) { if (SALT_PROVINCE_GROUPS.north.includes(province)) return 'north'; if (SALT_PROVINCE_GROUPS.central.includes(province)) return 'central'; return 'south' }

function getCookedMixFactor(formData) {
  const normalized = normalizeRatios(formData.riceRatio, formData.wheatRatio, formData.tuberRatio)
  return (normalized.riceRatio / 100) * COOKED_MULTIPLIER.rice + (normalized.wheatRatio / 100) * COOKED_MULTIPLIER.wheat + (normalized.tuberRatio / 100) * COOKED_MULTIPLIER.tuber
}

function getSexFactorForGrain(stageKey, sex) { return (stageKey === '0_1' || stageKey === '1_3' || stageKey === '4_6' || stageKey === '7_12') ? 1.0 : (sex === 'male' ? 1.06 : 0.94) }
function calcCookedFoodDayG(stageKey, formData, province) { return GRAIN_BASE_G_PER_DAY[stageKey] * getSexFactorForGrain(stageKey, formData.sex) * BODY_FACTOR_FOR_GRAIN[resolveBodyType(formData)] * ACTIVITY_FACTOR_FOR_GRAIN[formData.activityLevel] * getCookedMixFactor(formData) * PROVINCE_COOKED_FACTOR[getCookedProvinceGroup(province)] }
function calcSaltDayG(stageKey, formData, province) { return SALT_BASE_G_PER_DAY[stageKey] * PROVINCE_SALT_FACTOR[getSaltProvinceGroup(province)] * TASTE_FACTOR_FOR_SALT[formData.tasteLevel] * EATOUT_FACTOR_FOR_SALT[formData.eatOutLevel] * ACTIVITY_FACTOR_FOR_SALT[formData.activityLevel] }
function calcCookedUnits(totalCookedFoodKg) { return { totalBowls: totalCookedFoodKg / 0.15, totalRiceCookers: totalCookedFoodKg / COOKED_DISPLAY_UNITS.riceCookerKg, totalBuckets: totalCookedFoodKg / COOKED_DISPLAY_UNITS.bucketKg } }
function calcSaltUnits(totalSaltKg) { return { totalSaltBags: totalSaltKg / SALT_DISPLAY_UNITS.bagKg, totalSaltBoxes: totalSaltKg / SALT_DISPLAY_UNITS.boxKg, totalSaltSacks: totalSaltKg / SALT_DISPLAY_UNITS.sackKg } }

function buildCookedDisplay(totalCookedFoodKg) {
  const units = calcCookedUnits(totalCookedFoodKg)
  if (units.totalBowls < 120) return { primaryUnit: 'bowl', primaryValue: units.totalBowls, secondaryUnit: 'kg', secondaryValue: totalCookedFoodKg }
  if (units.totalBowls < 1500) return { primaryUnit: 'riceCooker', primaryValue: units.totalRiceCookers, secondaryUnit: 'bowl', secondaryValue: units.totalBowls }
  return { primaryUnit: 'bucket', primaryValue: units.totalBuckets, secondaryUnit: 'riceCooker', secondaryValue: units.totalRiceCookers }
}

function buildSaltDisplay(totalSaltKg) {
  const units = calcSaltUnits(totalSaltKg)
  if (units.totalSaltBags < 40) return { primaryUnit: 'bag', primaryValue: units.totalSaltBags, secondaryUnit: 'kg', secondaryValue: totalSaltKg }
  if (units.totalSaltBags < 200) return { primaryUnit: 'box', primaryValue: units.totalSaltBoxes, secondaryUnit: 'bag', secondaryValue: units.totalSaltBags }
  return { primaryUnit: 'sack', primaryValue: units.totalSaltSacks, secondaryUnit: 'box', secondaryValue: units.totalSaltBoxes }
}

function calculateAll(rawFormData) {
  const formData = { ...rawFormData, ...normalizeRatios(rawFormData.riceRatio, rawFormData.wheatRatio, rawFormData.tuberRatio) }
  const segments = splitLifeStages(formData.birthDate)
  let totalCookedFoodKg = 0
  let totalSaltKg = 0
  const stageBreakdown = segments.map((segment) => {
    const province = segment.ageStart < 18 ? formData.childhoodProvince : formData.adultProvince
    const cookedFoodKg = (calcCookedFoodDayG(segment.stageKey, formData, province) * segment.days) / 1000
    const saltKg = (calcSaltDayG(segment.stageKey, formData, province) * segment.days) / 1000
    totalCookedFoodKg += cookedFoodKg
    totalSaltKg += saltKg
    return { stageKey: segment.stageKey, days: segment.days, cookedFoodKg, saltKg }
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

module.exports = { calculateAll, buildCookedDisplay, buildSaltDisplay }
