import { STAGE_AGE_BOUNDARIES, STAGE_SEQUENCE } from '../../constants/stages'
import type { StageSegment } from '../../types/stage'
import { addDays, addYears, compareDate, diffDays, getTodayString, maxDate, minDate } from '../../utils/date'
import { getCurrentAgeYears } from './age'

export function splitLifeStages(birthDate: string, today = getTodayString()): StageSegment[] {
  if (compareDate(birthDate, today) > 0) {
    return []
  }

  const lifeEndExclusive = addDays(today, 1)
  const currentAge = getCurrentAgeYears(birthDate, today)

  return STAGE_SEQUENCE.reduce<StageSegment[]>((segments, stageKey) => {
    const config = STAGE_AGE_BOUNDARIES[stageKey]
    const stageStart = addYears(birthDate, config.startAge)
    const stageEndExclusive = config.endAgeExclusive === null ? lifeEndExclusive : addYears(birthDate, config.endAgeExclusive)
    const overlapStart = maxDate(stageStart, birthDate)
    const overlapEndExclusive = minDate(stageEndExclusive, lifeEndExclusive)
    const days = diffDays(overlapStart, overlapEndExclusive)

    if (days <= 0 || compareDate(overlapStart, overlapEndExclusive) >= 0) {
      return segments
    }

    segments.push({
      stageKey,
      startDate: overlapStart,
      endDate: addDays(overlapEndExclusive, -1),
      days,
      ageStart: config.startAge,
      ageEnd: stageKey === '75_plus' ? Math.max(currentAge, 75) : config.labelAgeEnd,
    })

    return segments
  }, [])
}
