const { getCurrentResultPayload } = require('../../store/session')

const ROW_MAX_WIDTH = 580

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
    normal: { width: 34, height: 30, overlap: 10, maxPerRow: 14, rowGap: 6 },
    dense: { width: 30, height: 26, overlap: 9, maxPerRow: 18, rowGap: 5 },
    compact: { width: 26, height: 23, overlap: 8, maxPerRow: 22, rowGap: 4 },
    xcompact: { width: 22, height: 19, overlap: 7, maxPerRow: 28, rowGap: 3 },
  },
  riceCooker: {
    normal: { width: 40, height: 38, overlap: 12, maxPerRow: 12, rowGap: 6 },
    dense: { width: 35, height: 33, overlap: 10, maxPerRow: 16, rowGap: 5 },
    compact: { width: 31, height: 29, overlap: 9, maxPerRow: 20, rowGap: 4 },
    xcompact: { width: 27, height: 25, overlap: 8, maxPerRow: 24, rowGap: 3 },
  },
  bucket: {
    normal: { width: 44, height: 54, overlap: 13, maxPerRow: 11, rowGap: 6 },
    dense: { width: 39, height: 48, overlap: 12, maxPerRow: 14, rowGap: 5 },
    compact: { width: 34, height: 42, overlap: 10, maxPerRow: 18, rowGap: 4 },
    xcompact: { width: 29, height: 36, overlap: 9, maxPerRow: 22, rowGap: 3 },
  },
  bag: {
    normal: { width: 30, height: 40, overlap: 9, maxPerRow: 14, rowGap: 6 },
    dense: { width: 27, height: 36, overlap: 8, maxPerRow: 18, rowGap: 5 },
    compact: { width: 24, height: 32, overlap: 7, maxPerRow: 22, rowGap: 4 },
    xcompact: { width: 21, height: 28, overlap: 6, maxPerRow: 26, rowGap: 3 },
  },
  box: {
    normal: { width: 34, height: 34, overlap: 10, maxPerRow: 13, rowGap: 6 },
    dense: { width: 30, height: 30, overlap: 9, maxPerRow: 17, rowGap: 5 },
    compact: { width: 26, height: 26, overlap: 8, maxPerRow: 21, rowGap: 4 },
    xcompact: { width: 22, height: 22, overlap: 7, maxPerRow: 26, rowGap: 3 },
  },
  sack: {
    normal: { width: 38, height: 48, overlap: 11, maxPerRow: 12, rowGap: 6 },
    dense: { width: 33, height: 42, overlap: 10, maxPerRow: 16, rowGap: 5 },
    compact: { width: 29, height: 36, overlap: 8, maxPerRow: 20, rowGap: 4 },
    xcompact: { width: 25, height: 31, overlap: 7, maxPerRow: 24, rowGap: 3 },
  },
}

function getNowDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function resolveDensity(count) {
  if (count > 80) {
    return 'xcompact'
  }
  if (count > 40) {
    return 'compact'
  }
  if (count > 18) {
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

function buildVisualGroups(pieces) {
  return pieces
    .filter((piece) => piece.visualCount > 0)
    .map((piece) => ({
      unit: piece.unit,
      title: piece.text,
      asset: ASSET_MAP[piece.unit],
      rows: buildRows(piece.unit, piece.visualCount),
    }))
}

function formatWeightText(totalKg, label) {
  if (totalKg >= 1000) {
    return `共计 ${(totalKg / 1000).toFixed(1)} 吨${label}`
  }
  if (totalKg >= 1) {
    return `共计 ${totalKg.toFixed(1)} kg ${label}`
  }
  return `共计 ${Math.round(totalKg * 1000)} g ${label}`
}

function joinSummary(primaryText, extraTexts) {
  if (extraTexts.length === 0) {
    return primaryText
  }
  if (extraTexts.length === 1) {
    return `${primaryText}，外加${extraTexts[0]}`
  }
  return `${primaryText}，外加${extraTexts[0]}和${extraTexts[1]}`
}

function buildCookedPieces(result) {
  const roundedPrimary = roundToTwo(result.cookedDisplay.primaryValue)

  if (result.cookedDisplay.primaryUnit === 'bucket') {
    const totalBowls = Math.floor(roundedPrimary * 200 + 1e-6)
    const buckets = Math.floor(totalBowls / 200)
    const remainBowls = totalBowls - buckets * 200
    const riceCookers = Math.floor(remainBowls / 10)
    const bowls = remainBowls - riceCookers * 10

    return [
      { unit: 'bucket', count: buckets, text: `${buckets}桶饭`, visualCount: buckets },
      { unit: 'riceCooker', count: riceCookers, text: `${riceCookers}个电饭煲`, visualCount: riceCookers },
      { unit: 'bowl', count: bowls, text: `${bowls}碗饭`, visualCount: bowls },
    ]
  }

  if (result.cookedDisplay.primaryUnit === 'riceCooker') {
    const totalBowls = Math.floor(roundedPrimary * 10 + 1e-6)
    const riceCookers = Math.floor(totalBowls / 10)
    const bowls = totalBowls - riceCookers * 10

    return [
      { unit: 'riceCooker', count: riceCookers, text: `${riceCookers}个电饭煲`, visualCount: riceCookers },
      { unit: 'bowl', count: bowls, text: `${bowls}碗饭`, visualCount: bowls },
    ]
  }

  const bowlsValue = roundedPrimary
  const visualCount = Math.max(1, Math.floor(bowlsValue))

  return [
    { unit: 'bowl', count: bowlsValue, text: `${bowlsValue.toFixed(2)}碗饭`, visualCount },
  ]
}

function buildSaltPieces(result) {
  const roundedPrimary = roundToTwo(result.saltDisplay.primaryValue)

  if (result.saltDisplay.primaryUnit === 'sack') {
    const totalBags = Math.floor(roundedPrimary * 50 + 1e-6)
    const sacks = Math.floor(totalBags / 50)
    const remainBags = totalBags - sacks * 50
    const boxes = Math.floor(remainBags / 20)
    const bags = remainBags - boxes * 20

    return [
      { unit: 'sack', count: sacks, text: `${sacks}麻袋盐`, visualCount: sacks },
      { unit: 'box', count: boxes, text: `${boxes}箱盐`, visualCount: boxes },
      { unit: 'bag', count: bags, text: `${bags}袋家用盐`, visualCount: bags },
    ]
  }

  if (result.saltDisplay.primaryUnit === 'box') {
    const totalBags = Math.floor(roundedPrimary * 20 + 1e-6)
    const boxes = Math.floor(totalBags / 20)
    const bags = totalBags - boxes * 20

    return [
      { unit: 'box', count: boxes, text: `${boxes}箱盐`, visualCount: boxes },
      { unit: 'bag', count: bags, text: `${bags}袋家用盐`, visualCount: bags },
    ]
  }

  const bagsValue = roundedPrimary
  const visualCount = Math.max(1, Math.floor(bagsValue))

  return [
    { unit: 'bag', count: bagsValue, text: `${bagsValue.toFixed(2)}袋家用盐`, visualCount },
  ]
}

function buildCookedCard(result) {
  const pieces = buildCookedPieces(result)
  const highToLow = pieces.filter((piece) => piece.count > 0)
  const lowToHigh = [...highToLow].reverse()

  return {
    label: '到目前为止，我一共吃了',
    summaryText: joinSummary(
      highToLow[0] ? highToLow[0].text : '0碗饭',
      highToLow.slice(1).map((piece) => piece.text),
    ),
    weightText: formatWeightText(result.totalCookedFoodKg, '熟主食'),
    visualGroups: buildVisualGroups(lowToHigh),
  }
}

function buildSaltCard(result) {
  const pieces = buildSaltPieces(result)
  const highToLow = pieces.filter((piece) => piece.count > 0)
  const lowToHigh = [...highToLow].reverse()

  return {
    label: '到目前为止，我一共吃了',
    summaryText: joinSummary(
      highToLow[0] ? highToLow[0].text : '0袋家用盐',
      highToLow.slice(1).map((piece) => piece.text),
    ),
    weightText: formatWeightText(result.totalSaltKg, '盐'),
    visualGroups: buildVisualGroups(lowToHigh),
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
