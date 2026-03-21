const { getCurrentResultPayload } = require('../../store/session')

function formatDisplayNumber(value) {
  const digits = value >= 100 ? 0 : 1
  return value.toFixed(digits)
}

function formatKg(value) {
  return value.toFixed(1)
}

function getNowDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildCookedPrimary(result) {
  if (result.cookedDisplay.primaryUnit === 'bowl') {
    return `${formatDisplayNumber(result.cookedDisplay.primaryValue)} 碗主食`
  }
  if (result.cookedDisplay.primaryUnit === 'riceCooker') {
    return `${formatDisplayNumber(result.cookedDisplay.primaryValue)} 个电饭煲`
  }
  return `${formatDisplayNumber(result.cookedDisplay.primaryValue)} 个饭桶`
}

function buildCookedSecondary(result) {
  if (result.cookedDisplay.secondaryUnit === 'kg') {
    return `约等于 ${formatKg(result.cookedDisplay.secondaryValue)} kg 熟主食`
  }
  if (result.cookedDisplay.secondaryUnit === 'bowl') {
    return `也就是 ${formatDisplayNumber(result.cookedDisplay.secondaryValue)} 碗主食`
  }
  return `也就是 ${formatDisplayNumber(result.cookedDisplay.secondaryValue)} 个电饭煲`
}

function buildSaltPrimary(result) {
  if (result.saltDisplay.primaryUnit === 'bag') {
    return `${formatDisplayNumber(result.saltDisplay.primaryValue)} 袋家用盐`
  }
  if (result.saltDisplay.primaryUnit === 'box') {
    return `${formatDisplayNumber(result.saltDisplay.primaryValue)} 箱盐`
  }
  return `${formatDisplayNumber(result.saltDisplay.primaryValue)} 麻袋盐`
}

function buildSaltSecondary(result) {
  if (result.saltDisplay.secondaryUnit === 'kg') {
    return `约等于 ${formatKg(result.saltDisplay.secondaryValue)} kg 盐`
  }
  if (result.saltDisplay.secondaryUnit === 'bag') {
    return `也就是 ${formatDisplayNumber(result.saltDisplay.secondaryValue)} 袋家用盐`
  }
  return `也就是 ${formatDisplayNumber(result.saltDisplay.secondaryValue)} 箱盐`
}

Page({
  data: {
    empty: true,
    sourceDate: '',
    ageText: '',
    cookedPrimaryText: '',
    cookedSecondaryText: '',
    cookedKgText: '',
    saltPrimaryText: '',
    saltSecondaryText: '',
    saltKgText: '',
  },

  onLoad() {
    const payload = getCurrentResultPayload()

    if (!payload) {
      this.setData({ empty: true })
      return
    }

    this.setData({
      empty: false,
      sourceDate: getNowDateString(),
      ageText: `${payload.result.ageYears} 岁`,
      cookedPrimaryText: buildCookedPrimary(payload.result),
      cookedSecondaryText: buildCookedSecondary(payload.result),
      cookedKgText: `${formatKg(payload.result.totalCookedFoodKg)} kg 熟主食`,
      saltPrimaryText: buildSaltPrimary(payload.result),
      saltSecondaryText: buildSaltSecondary(payload.result),
      saltKgText: `${formatKg(payload.result.totalSaltKg)} kg 盐`,
    })
  },

  goHome() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  goEdit() {
    wx.reLaunch({
      url: '/pages/form/index',
      fail() {
        wx.showToast({
          title: '重新进入表单失败',
          icon: 'none',
        })
      },
    })
  },

  goAbout() {
    wx.navigateTo({
      url: '/pages/about/index',
      fail() {
        wx.showToast({
          title: '进入说明页失败',
          icon: 'none',
        })
      },
    })
  },
})
