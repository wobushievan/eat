const { calculateAll } = require('../../services/calc/result')
const { getLatestForm, saveLatestForm } = require('../../services/storage/form')
const { setCurrentResultPayload } = require('../../store/session')

const TODAY_MIN = '1900-01-01'

const PROVINCE_OPTIONS = [
  { label: '北京市', value: 'beijing' },
  { label: '天津市', value: 'tianjin' },
  { label: '上海市', value: 'shanghai' },
  { label: '重庆市', value: 'chongqing' },
  { label: '河北省', value: 'hebei' },
  { label: '山西省', value: 'shanxi' },
  { label: '辽宁省', value: 'liaoning' },
  { label: '吉林省', value: 'jilin' },
  { label: '黑龙江省', value: 'heilongjiang' },
  { label: '江苏省', value: 'jiangsu' },
  { label: '浙江省', value: 'zhejiang' },
  { label: '安徽省', value: 'anhui' },
  { label: '福建省', value: 'fujian' },
  { label: '江西省', value: 'jiangxi' },
  { label: '山东省', value: 'shandong' },
  { label: '河南省', value: 'henan' },
  { label: '湖北省', value: 'hubei' },
  { label: '湖南省', value: 'hunan' },
  { label: '广东省', value: 'guangdong' },
  { label: '海南省', value: 'hainan' },
  { label: '四川省', value: 'sichuan' },
  { label: '贵州省', value: 'guizhou' },
  { label: '云南省', value: 'yunnan' },
  { label: '陕西省', value: 'shaanxi' },
  { label: '甘肃省', value: 'gansu' },
  { label: '青海省', value: 'qinghai' },
  { label: '内蒙古自治区', value: 'neimenggu' },
  { label: '广西壮族自治区', value: 'guangxi' },
  { label: '西藏自治区', value: 'xizang' },
  { label: '宁夏回族自治区', value: 'ningxia' },
  { label: '新疆维吾尔自治区', value: 'xinjiang' },
]

const DEFAULT_FORM_DATA = {
  birthDate: '2000-01-01',
  sex: 'female',
  bodyInputMode: 'exact',
  activityLevel: 'medium',
  childhoodProvince: 'shanxi',
  adultProvince: 'guangdong',
  riceRatio: 50,
  wheatRatio: 30,
  tuberRatio: 20,
  tasteLevel: 'normal',
  eatOutLevel: 'medium',
}

function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function findProvinceIndex(value) {
  const index = PROVINCE_OPTIONS.findIndex((item) => item.value === value)
  return index >= 0 ? index : 0
}

function buildFormData(base) {
  return {
    ...base,
    riceRatio: Math.max(0, Math.min(100, Math.round(base.riceRatio))),
    wheatRatio: Math.max(0, Math.min(100, Math.round(base.wheatRatio))),
    tuberRatio: Math.max(0, Math.min(100, Math.round(base.tuberRatio))),
  }
}

function buildRatioFromBoundaries(first, second) {
  const safeFirst = Math.max(0, Math.min(100, Math.round(first)))
  const safeSecond = Math.max(safeFirst, Math.min(100, Math.round(second)))

  return {
    riceRatio: safeFirst,
    wheatRatio: safeSecond - safeFirst,
    tuberRatio: 100 - safeSecond,
  }
}

function buildBoundariesFromRatio(ratio) {
  return {
    first: ratio.riceRatio,
    second: ratio.riceRatio + ratio.wheatRatio,
  }
}

function normalizeRatioValue(ratio) {
  const rice = Math.max(0, ratio.riceRatio)
  const wheat = Math.max(0, ratio.wheatRatio)
  const tuber = Math.max(0, ratio.tuberRatio)
  const total = rice + wheat + tuber

  if (total <= 0) {
    return {
      riceRatio: DEFAULT_FORM_DATA.riceRatio,
      wheatRatio: DEFAULT_FORM_DATA.wheatRatio,
      tuberRatio: DEFAULT_FORM_DATA.tuberRatio,
    }
  }

  const first = Math.round((rice / total) * 100)
  const second = Math.round(((rice + wheat) / total) * 100)
  return buildRatioFromBoundaries(first, second)
}

function validateAll(formData, today) {
  if (!formData.birthDate) return '请选择出生日期'
  if (formData.birthDate < TODAY_MIN) return '出生日期不能早于 1900-01-01'
  if (formData.birthDate > today) return '出生日期不能晚于今天'

  if (formData.bodyInputMode === 'exact') {
    if (!formData.heightCm || formData.heightCm < 80 || formData.heightCm > 230) return '身高填个正常范围吧，80-230 cm 之间'
    if (!formData.weightKg || formData.weightKg < 10 || formData.weightKg > 250) return '体重填个正常范围吧，10-250 kg 之间'
  } else if (!formData.bodyType) {
    return '选一下你觉得自己的体型'
  }

  if (!formData.childhoodProvince) return '选一下你 0-17 岁主要长大的地方'
  if (!formData.adultProvince) return '选一下你 18 岁后主要居住的地方'

  const total = formData.riceRatio + formData.wheatRatio + formData.tuberRatio
  if (total !== 100) return '主食偏好总和必须等于 100'
  if (!formData.tasteLevel) return '请选择口味偏好'
  if (!formData.eatOutLevel) return '请选择外食频率'

  return ''
}

Page({
  data: {
    today: getTodayString(),
    provinceLabelsChildhood: PROVINCE_OPTIONS.map((item) => item.label),
    provinceLabelsAdult: PROVINCE_OPTIONS.map((item) => item.label),
    sexOptions: [
      { label: '男性', value: 'male' },
      { label: '女性', value: 'female' },
    ],
    bodyModeOptions: [
      { label: '身高体重', value: 'exact' },
      { label: '不方便细说', value: 'simple' },
    ],
    bodyTypeOptions: [
      { label: '偏瘦', value: 'slim' },
      { label: '标准', value: 'standard' },
      { label: '偏壮', value: 'strong' },
    ],
    activityOptions: [
      { label: '活动少', value: 'low', description: '久坐不动，日常步数基本靠取外卖 / 上厕所' },
      { label: '一般活动', value: 'medium', description: '上班通勤 + 摸鱼走动，活动量平平无奇' },
      { label: '高活动量', value: 'high', description: '搬砖 / 健身人，体力消耗拉满' },
    ],
    tasteOptions: [
      { label: '清淡', value: 'light' },
      { label: '一般', value: 'normal' },
      { label: '偏咸', value: 'salty' },
    ],
    eatOutOptions: [
      { label: '宅家干饭，很少出门吃', value: 'low' },
      { label: '随缘，家里 / 外卖轮着来', value: 'medium' },
      { label: '外食达人，基本靠馆子 / 外卖续命', value: 'high' },
    ],
    childhoodProvinceIndex: findProvinceIndex(DEFAULT_FORM_DATA.childhoodProvince),
    adultProvinceIndex: findProvinceIndex(DEFAULT_FORM_DATA.adultProvince),
    ratioValue: {
      riceRatio: DEFAULT_FORM_DATA.riceRatio,
      wheatRatio: DEFAULT_FORM_DATA.wheatRatio,
      tuberRatio: DEFAULT_FORM_DATA.tuberRatio,
    },
    ratioBoundaries: buildBoundariesFromRatio({
      riceRatio: DEFAULT_FORM_DATA.riceRatio,
      wheatRatio: DEFAULT_FORM_DATA.wheatRatio,
      tuberRatio: DEFAULT_FORM_DATA.tuberRatio,
    }),
    ratioTrackLeft: 0,
    ratioTrackWidth: 0,
    activeRatioHandle: '',
    errorText: '',
    formData: DEFAULT_FORM_DATA,
  },

  onLoad() {
    const cached = getLatestForm()
    const nextFormData = buildFormData({
      ...DEFAULT_FORM_DATA,
      ...(cached || {}),
    })
    const normalizedRatio = normalizeRatioValue({
      riceRatio: nextFormData.riceRatio,
      wheatRatio: nextFormData.wheatRatio,
      tuberRatio: nextFormData.tuberRatio,
    })
    const nextWithRatio = {
      ...nextFormData,
      ...normalizedRatio,
    }

    this.setData({
      formData: nextWithRatio,
      childhoodProvinceIndex: findProvinceIndex(nextWithRatio.childhoodProvince),
      adultProvinceIndex: findProvinceIndex(nextWithRatio.adultProvince),
      ratioValue: normalizedRatio,
      ratioBoundaries: buildBoundariesFromRatio(normalizedRatio),
    })
  },

  onReady() {
    this.measureRatioTrack()
  },

  onShow() {
    this.measureRatioTrack()
  },

  measureRatioTrack() {
    const query = this.createSelectorQuery()
    query.select('#ratioTrack').boundingClientRect((rect) => {
      if (!rect) {
        return
      }

      this.setData({
        ratioTrackLeft: rect.left,
        ratioTrackWidth: rect.width,
      })
    })
    query.exec()
  },

  onBirthDateChange(event) {
    this.setData({
      'formData.birthDate': event.detail.value,
      errorText: '',
    })
  },

  onSexChange(event) {
    this.setData({
      'formData.sex': event.detail.value,
      errorText: '',
    })
  },

  onBodyModeChange(event) {
    const bodyInputMode = event.detail.value
    const nextFormData = {
      ...this.data.formData,
      bodyInputMode,
    }

    if (bodyInputMode === 'simple' && !nextFormData.bodyType) {
      nextFormData.bodyType = 'standard'
    }

    this.setData({
      formData: nextFormData,
      errorText: '',
    })
  },

  onBodyTypeChange(event) {
    this.setData({
      'formData.bodyType': event.detail.value,
      errorText: '',
    })
  },

  onHeightInput(event) {
    this.setData({
      'formData.heightCm': Number(event.detail.value) || undefined,
      errorText: '',
    })
  },

  onWeightInput(event) {
    this.setData({
      'formData.weightKg': Number(event.detail.value) || undefined,
      errorText: '',
    })
  },

  onActivityChange(event) {
    this.setData({
      'formData.activityLevel': event.detail.value,
      errorText: '',
    })
  },

  onChildhoodProvinceChange(event) {
    const index = Number(event.detail.value)
    const province = PROVINCE_OPTIONS[index]

    this.setData({
      childhoodProvinceIndex: index,
      'formData.childhoodProvince': province.value,
      errorText: '',
    })
  },

  onAdultProvinceChange(event) {
    const index = Number(event.detail.value)
    const province = PROVINCE_OPTIONS[index]

    this.setData({
      adultProvinceIndex: index,
      'formData.adultProvince': province.value,
      errorText: '',
    })
  },

  applyRatioBoundaries(first, second) {
    const nextRatio = buildRatioFromBoundaries(first, second)

    this.setData({
      ratioValue: nextRatio,
      ratioBoundaries: buildBoundariesFromRatio(nextRatio),
      'formData.riceRatio': nextRatio.riceRatio,
      'formData.wheatRatio': nextRatio.wheatRatio,
      'formData.tuberRatio': nextRatio.tuberRatio,
      errorText: '',
    })
  },

  updateRatioByPageX(pageX, handle) {
    if (!this.data.ratioTrackWidth) {
      this.measureRatioTrack()
      return
    }

    const percent = ((pageX - this.data.ratioTrackLeft) / this.data.ratioTrackWidth) * 100

    if (handle === 'first') {
      this.applyRatioBoundaries(percent, this.data.ratioBoundaries.second)
      return
    }

    this.applyRatioBoundaries(this.data.ratioBoundaries.first, percent)
  },

  onRatioHandleStart(event) {
    const handle = event.currentTarget.dataset.handle
    const touch = event.touches[0]

    this.setData({
      activeRatioHandle: handle,
      errorText: '',
    })

    if (touch) {
      this.updateRatioByPageX(touch.pageX, handle)
    }
  },

  onRatioHandleMove(event) {
    const handle = this.data.activeRatioHandle || event.currentTarget.dataset.handle
    const touch = event.touches[0]

    if (touch) {
      this.updateRatioByPageX(touch.pageX, handle)
    }
  },

  onRatioHandleEnd() {
    this.setData({
      activeRatioHandle: '',
    })
  },

  onRatioTrackTap(event) {
    const touch = event.changedTouches[0]

    if (!touch || !this.data.ratioTrackWidth) {
      return
    }

    const percent = ((touch.pageX - this.data.ratioTrackLeft) / this.data.ratioTrackWidth) * 100
    const distanceToFirst = Math.abs(percent - this.data.ratioBoundaries.first)
    const distanceToSecond = Math.abs(percent - this.data.ratioBoundaries.second)
    const handle = distanceToFirst <= distanceToSecond ? 'first' : 'second'

    this.updateRatioByPageX(touch.pageX, handle)
  },

  onTasteChange(event) {
    this.setData({
      'formData.tasteLevel': event.detail.value,
      errorText: '',
    })
  },

  onEatOutChange(event) {
    this.setData({
      'formData.eatOutLevel': event.detail.value,
      errorText: '',
    })
  },

  showError(errorText) {
    this.setData({ errorText })
    wx.showToast({
      title: errorText,
      icon: 'none',
    })
  },

  handleBack() {
    wx.navigateBack({
      fail() {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      },
    })
  },

  handleSubmit() {
    const formData = buildFormData(this.data.formData)
    const errorText = validateAll(formData, this.data.today)

    if (errorText) {
      this.showError(errorText)
      return
    }

    const saved = saveLatestForm(formData)
    if (!saved) {
      wx.showToast({
        title: '本地保存失败，请稍后重试',
        icon: 'none',
      })
      return
    }

    const result = calculateAll(formData)
    setCurrentResultPayload({ formData, result })

    wx.navigateTo({
      url: '/pages/result/index',
      fail() {
        wx.showToast({
          title: '进入结果页失败',
          icon: 'none',
        })
      },
    })
  },
})
