import type { RatioValue } from '../../types/form'

type RatioKey = keyof RatioValue

function distribute(value: RatioValue, targetKey: RatioKey, nextValue: number): RatioValue {
  const safeNext = Math.max(0, Math.min(100, Math.round(nextValue)))
  const restKeys = (['riceRatio', 'wheatRatio', 'tuberRatio'] as RatioKey[]).filter((key) => key !== targetKey)
  const restTotal = value[restKeys[0]] + value[restKeys[1]]
  const remain = 100 - safeNext

  if (remain <= 0) {
    return {
      riceRatio: targetKey === 'riceRatio' ? 100 : 0,
      wheatRatio: targetKey === 'wheatRatio' ? 100 : 0,
      tuberRatio: targetKey === 'tuberRatio' ? 100 : 0,
    }
  }

  const first = restTotal === 0 ? Math.round(remain / 2) : Math.round((remain * value[restKeys[0]]) / restTotal)
  const second = remain - first

  return {
    ...value,
    [targetKey]: safeNext,
    [restKeys[0]]: first,
    [restKeys[1]]: second,
  }
}

Component({
  properties: {
    value: {
      type: Object,
      value: {
        riceRatio: 50,
        wheatRatio: 40,
        tuberRatio: 10,
      },
    },
  },
  data: {
    innerValue: {
      riceRatio: 50,
      wheatRatio: 40,
      tuberRatio: 10,
    },
  },
  observers: {
    value(next: RatioValue) {
      this.setData({
        innerValue: next,
      })
    },
  },
  methods: {
    emitChange(nextValue: RatioValue) {
      this.setData({
        innerValue: nextValue,
      })
      this.triggerEvent('change', nextValue)
    },
    onSliderChange(event: WechatMiniprogram.CustomEvent<{ value: number }>) {
      const key = event.currentTarget.dataset.key as RatioKey
      const nextValue = Number(event.detail.value)
      const current = this.data.innerValue as RatioValue
      this.emitChange(distribute(current, key, nextValue))
    },
    onReset() {
      this.emitChange({
        riceRatio: 50,
        wheatRatio: 40,
        tuberRatio: 10,
      })
    },
  },
})
