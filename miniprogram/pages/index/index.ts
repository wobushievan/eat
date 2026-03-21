Page({
  data: {},

  handleStart() {
    wx.navigateTo({
      url: '/pages/form/index',
      fail() {
        wx.showToast({
          title: '进入表单失败',
          icon: 'none',
        })
      },
    })
  },
})
