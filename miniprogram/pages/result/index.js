const { getCurrentResultPayload } = require('../../store/session')

const ASSET_MAP = {
  bowl: '../../assets/result-units/bowl.png',
  riceCooker: '../../assets/result-units/rice-cooker.png',
  bucket: '../../assets/result-units/bucket.png',
  bag: '../../assets/result-units/salt-bag.png',
  box: '../../assets/result-units/salt-box.png',
  sack: '../../assets/result-units/salt-sack.png',
}

const LAYOUT_MAP = {
  bowl: {
    normal: { width: 44, height: 38, overlap: 13, maxPerRow: 12, rowGap: 8 },
    dense: { width: 38, height: 33, overlap: 11, maxPerRow: 16, rowGap: 6 },
    compact: { width: 33, height: 28, overlap: 10, maxPerRow: 20, rowGap: 5 },
    xcompact: { width: 28, height: 24, overlap: 8, maxPerRow: 28, rowGap: 4 },
  },
  riceCooker: {
    normal: { width: 50, height: 48, overlap: 15, maxPerRow: 12, rowGap: 8 },
    dense: { width: 43, height: 41, overlap: 13, maxPerRow: 16, rowGap: 6 },
    compact: { width: 37, height: 35, overlap: 11, maxPerRow: 20, rowGap: 5 },
    xcompact: { width: 31, height: 29, overlap: 9, maxPerRow: 28, rowGap: 4 },
  },
  bucket: {
    normal: { width: 56, height: 68, overlap: 17, maxPerRow: 12, rowGap: 9 },
    dense: { width: 48, height: 58, overlap: 14, maxPerRow: 16, rowGap: 7 },
    compact: { width: 40, height: 49, overlap: 12, maxPerRow: 20, rowGap: 5 },
    xcompact: { width: 34, height: 41, overlap: 10, maxPerRow: 28, rowGap: 4 },
  },
  bag: {
    normal: { width: 42, height: 56, overlap: 13, maxPerRow: 12, rowGap: 8 },
    dense: { width: 36, height: 49, overlap: 11, maxPerRow: 16, rowGap: 6 },
    compact: { width: 31, height: 42, overlap: 9, maxPerRow: 20, rowGap: 5 },
    xcompact: { width: 27, height: 36, overlap: 8, maxPerRow: 28, rowGap: 4 },
  },
  box: {
    normal: { width: 44, height: 44, overlap: 13, maxPerRow: 12, rowGap: 8 },
    dense: { width: 38, height: 38, overlap: 11, maxPerRow: 16, rowGap: 6 },
    compact: { width: 33, height: 33, overlap: 10, maxPerRow: 20, rowGap: 5 },
    xcompact: { width: 28, height: 28, overlap: 8, maxPerRow: 28, rowGap: 4 },
  },
  sack: {
    normal: { width: 48, height: 60, overlap: 14, maxPerRow: 12, rowGap: 8 },
    dense: { width: 42, height: 52, overlap: 12, maxPerRow: 16, rowGap: 6 },
    compact: { width: 36, height: 45, overlap: 10, maxPerRow: 20, rowGap: 5 },
    xcompact: { width: 31, height: 38, overlap: 8, maxPerRow: 28, rowGap: 4 },
  },
}

const FRACTION_RULES = {
  riceCooker: { unit: 'bowl', multiplier: 10 },
  bucket: { unit: 'riceCooker', multiplier: 20 },
  box: { unit: 'bag', multiplier: 20 },
  sack: { unit: 'box', multiplier: 2.5 },
}

const ROW_MAX_WIDTH = 620

function getNowDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function resolveDensity(count) {
  if (count > 48) {
    return 'xcompact'
  }
  if (count > 24) {
    return 'compact'
  }
  if (count > 12) {
    return 'dense'
  }
  return 'normal'
}

function buildRows(unit, count) {
  const density = resolveDensity(count)
  const metric = LAYOUT_MAP[unit][density]
  const rows = []
  let remaining = Math.max(1, count)
  let rowIndex = 0
  const step = Math.max(1, metric.width - metric.overlap)
  const capacityByWidth = Math.max(1, Math.floor((ROW_MAX_WIDTH - metric.width) / step) + 1)
  const rowCapacity = Math.max(1, Math.min(metric.maxPerRow, capacityByWidth))

  while (remaining > 0) {
    const take = Math.min(rowCapacity, remaining)
    const icons = Array.from({ length: take }, (_, index) => ({
      style: `width:${metric.width}rpx;height:${metric.height}rpx;${index > 0 ? `margin-left:-${metric.overlap}rpx;` : ''}`,
    }))

    rows.push({
      style: rowIndex > 0 ? `margin-top:${metric.rowGap}rpx;` : '',
      icons,
    })

    remaining -= take
    rowIndex += 1
  }

  return rows
}

function buildRow(unit, title, count) {
  return {
    title,
    asset: ASSET_MAP[unit],
    rows: buildRows(unit, count),
  }
}

function formatWeightText(totalKg, label) {
  if (totalKg >= 1000) {
    return `一共是${(totalKg / 1000).toFixed(1)}吨${label}`
  }
  if (totalKg >= 1) {
    return `一共是${totalKg.toFixed(1)}kg${label}`
  }
  return `一共是${Math.round(totalKg * 1000)}g${label}`
}

function getCookedUnitTitle(unit, value) {
  if (unit === 'bucket') {
    return `${value}桶饭`
  }
  if (unit === 'riceCooker') {
    return `${value}个电饭煲`
  }
  return `${value}碗饭`
}

function getSaltUnitTitle(unit, value) {
  if (unit === 'sack') {
    return `${value}麻袋盐`
  }
  if (unit === 'box') {
    return `${value}箱盐`
  }
  return `${value}袋家用盐`
}

function resolveCookedUnit(primaryUnit) {
  if (primaryUnit === 'bowl') {
    return 'bowl'
  }
  if (primaryUnit === 'riceCooker') {
    return 'riceCooker'
  }
  return 'bucket'
}

function resolveSaltUnit(primaryUnit) {
  if (primaryUnit === 'bag') {
    return 'bag'
  }
  if (primaryUnit === 'box') {
    return 'box'
  }
  return 'sack'
}

function buildCookedCard(result) {
  const unit = resolveCookedUnit(result.cookedDisplay.primaryUnit)
  const rawValue = result.cookedDisplay.primaryValue
  const integerPart = Math.floor(rawValue)
  const primaryCount = integerPart >= 1 ? integerPart : Math.max(1, Math.round(rawValue))
  const primaryRow = buildRow(unit, getCookedUnitTitle(unit, primaryCount), primaryCount)

  let secondaryRow = null
  const fractionRule = FRACTION_RULES[unit]

  if (fractionRule && integerPart >= 1) {
    const fractionCount = Math.floor((rawValue - integerPart) * fractionRule.multiplier)
    if (fractionCount >= 1) {
      secondaryRow = buildRow(
        fractionRule.unit,
        getCookedUnitTitle(fractionRule.unit, fractionCount),
        fractionCount,
      )
    }
  }

  return {
    label: '到目前为止，我一共吃了',
    primaryRow,
    secondaryRow,
    totalText: formatWeightText(result.totalCookedFoodKg, '熟主食'),
  }
}

function buildSaltCard(result) {
  const unit = resolveSaltUnit(result.saltDisplay.primaryUnit)
  const rawValue = result.saltDisplay.primaryValue
  const integerPart = Math.floor(rawValue)
  const primaryCount = integerPart >= 1 ? integerPart : Math.max(1, Math.round(rawValue))
  const primaryRow = buildRow(unit, getSaltUnitTitle(unit, primaryCount), primaryCount)

  let secondaryRow = null
  const fractionRule = FRACTION_RULES[unit]

  if (fractionRule && integerPart >= 1) {
    const fractionCount = Math.floor((rawValue - integerPart) * fractionRule.multiplier)
    if (fractionCount >= 1) {
      secondaryRow = buildRow(
        fractionRule.unit,
        getSaltUnitTitle(fractionRule.unit, fractionCount),
        fractionCount,
      )
    }
  }

  return {
    label: '到目前为止，我一共吃了',
    primaryRow,
    secondaryRow,
    totalText: formatWeightText(result.totalSaltKg, '盐'),
  }
}

Page({
  data: {
    empty: true,
    sourceDate: '',
    ageText: '',
    cookedCard: null,
    saltCard: null,
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
      ageText: `${payload.result.ageYears}岁`,
      cookedCard: buildCookedCard(payload.result),
      saltCard: buildSaltCard(payload.result),
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
