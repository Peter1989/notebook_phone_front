// pages/tag/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    profile: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      profile: app.globalData.profile
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  submit() {
    var that = this;
    if (!that.data.profile) {
      var tilteObj = {
        title: '请填写简介后再提交',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return;
    }
    wx.request({
      url: 'https://www.funyang.top/minipro/user/uploadinfo',
      data: {
        profile: that.data.profile
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.success) {
          app.globalData.profile = that.data.profile;
          wx.navigateBack({
            delta: 1
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  bindProfile(e) {
    this.setData({
      profile: e.detail.value
    })
  }
})