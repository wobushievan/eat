export type StageKey =
  | '0_1'
  | '1_3'
  | '4_6'
  | '7_12'
  | '13_17'
  | '18_29'
  | '30_44'
  | '45_59'
  | '60_74'
  | '75_plus'

export interface StageSegment {
  stageKey: StageKey
  startDate: string
  endDate: string
  days: number
  ageStart: number
  ageEnd: number
}

export interface StageBreakdownItem {
  stageKey: StageKey
  days: number
  cookedFoodKg: number
  saltKg: number
}
