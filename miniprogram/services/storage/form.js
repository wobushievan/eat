const STORAGE_KEYS = {
  latestForm: 'diet_calc_latest_form',
}

function saveLatestForm(formData) {
  try {
    wx.setStorageSync(STORAGE_KEYS.latestForm, formData)
    return true
  } catch (error) {
    console.warn('saveLatestForm failed', error)
    return false
  }
}

function getLatestForm() {
  try {
    return wx.getStorageSync(STORAGE_KEYS.latestForm) || null
  } catch (error) {
    console.warn('getLatestForm failed', error)
    return null
  }
}

module.exports = {
  saveLatestForm,
  getLatestForm,
}
