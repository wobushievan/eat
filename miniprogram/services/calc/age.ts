import { getTodayString, parseDateString } from '../../utils/date'

export function getCurrentAgeYears(birthDate: string, today = getTodayString()): number {
  const birth = parseDateString(birthDate)
  const current = parseDateString(today)

  let age = current.getUTCFullYear() - birth.getUTCFullYear()
  const monthDiff = current.getUTCMonth() - birth.getUTCMonth()
  const dayDiff = current.getUTCDate() - birth.getUTCDate()

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1
  }

  return Math.max(age, 0)
}
