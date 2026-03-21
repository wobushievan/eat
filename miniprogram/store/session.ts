import type { UserFormData } from '../types/form'
import type { CalculationResult } from '../types/result'

interface ResultSessionPayload {
  formData: UserFormData
  result: CalculationResult
}

let currentPayload: ResultSessionPayload | null = null

export function setCurrentResultPayload(payload: ResultSessionPayload | null) {
  currentPayload = payload
}

export function getCurrentResultPayload(): ResultSessionPayload | null {
  return currentPayload
}
