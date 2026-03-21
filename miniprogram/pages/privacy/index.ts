import { STORAGE_KEYS } from '../../constants/storage'

Page({
  data: {
    accepted: false,
  },
  onShow() {
    this.setData({
      accepted: !!wx.getStorageSync(STORAGE_KEYS.privacyAccepted),
    })
  },
  acceptPrivacy() {
    try {
      wx.setStorageSync(STORAGE_KEYS.privacyAccepted, true)
      this.setData({ accepted: true })
      wx.showToast({
        title: '已记录',
        icon: 'success',
      })
    } catch (error) {
      console.warn('accept privacy failed', error)
      wx.showToast({
        title: '保存失败，请稍后重试',
        icon: 'none',
      })
    }
  },
})
