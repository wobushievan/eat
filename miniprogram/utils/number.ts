export function roundTo(value: number, digits = 1): number {
  const base = 10 ** digits
  return Math.round(value * base) / base
}

export function formatDisplayValue(value: number): string {
  const digits = value >= 100 ? 0 : 1
  return roundTo(value, digits).toFixed(digits)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
