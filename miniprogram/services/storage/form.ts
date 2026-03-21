import { STORAGE_KEYS } from '../../constants/storage'
import type { UserFormData } from '../../types/form'

export function saveLatestForm(formData: UserFormData): boolean {
  try {
    wx.setStorageSync(STORAGE_KEYS.latestForm, formData)
    return true
  } catch (error) {
    console.warn('saveLatestForm failed', error)
    return false
  }
}

export function getLatestForm(): UserFormData | null {
  try {
    return wx.getStorageSync(STORAGE_KEYS.latestForm) || null
  } catch (error) {
    console.warn('getLatestForm failed', error)
    return null
  }
}
