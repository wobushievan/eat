import type { StageKey } from '../types/stage'

export const STAGE_SEQUENCE: StageKey[] = [
  '0_1',
  '1_3',
  '4_6',
  '7_12',
  '13_17',
  '18_29',
  '30_44',
  '45_59',
  '60_74',
  '75_plus',
]

export const STAGE_AGE_BOUNDARIES: Record<
  StageKey,
  { startAge: number; endAgeExclusive: number | null; labelAgeEnd: number }
> = {
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
