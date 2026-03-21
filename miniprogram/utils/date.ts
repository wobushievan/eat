const DAY_MS = 24 * 60 * 60 * 1000

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

export function formatDateString(date: Date): string {
  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${date.getUTCDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayString(): string {
  const now = new Date()
  return formatDateString(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
}

export function addYears(dateStr: string, years: number): string {
  const date = parseDateString(dateStr)
  const year = date.getUTCFullYear() + years
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  const target = new Date(Date.UTC(year, month, day))

  if (target.getUTCMonth() !== month) {
    return formatDateString(new Date(Date.UTC(year, month + 1, 0)))
  }

  return formatDateString(target)
}

export function addDays(dateStr: string, days: number): string {
  const date = parseDateString(dateStr)
  return formatDateString(new Date(date.getTime() + days * DAY_MS))
}

export function diffDays(startDate: string, endDateExclusive: string): number {
  const start = parseDateString(startDate)
  const end = parseDateString(endDateExclusive)
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / DAY_MS))
}

export function compareDate(a: string, b: string): number {
  return parseDateString(a).getTime() - parseDateString(b).getTime()
}

export function minDate(a: string, b: string): string {
  return compareDate(a, b) <= 0 ? a : b
}

export function maxDate(a: string, b: string): string {
  return compareDate(a, b) >= 0 ? a : b
}

export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const parsed = parseDateString(value)
  return formatDateString(parsed) === value
}
