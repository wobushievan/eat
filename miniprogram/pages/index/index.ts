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

  handleAbout() {
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
