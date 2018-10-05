// pages/tag/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      username: app.globalData.username
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
    return {
      title: '闲暇时间消化零散知识，线上互撩的随身忆了解一下？',
      path: '/pages/index/index',
      imageUrl: 'https://7465-test-940daf-1257680529.tcb.qcloud.la/demo1.png?sign=03800fadb75c68f5bfda19d44619ef3d&t=1538741837'
    }
  },
  submit(){
    var that = this;
    if (!that.data.username) {
      var tilteObj = {
        title: '请填写名字后再提交',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return;
    }
    wx.request({
      url: 'https://www.funyang.top/minipro/user/uploadinfo',
      data: {
        username: that.data.username
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if(res.data.success){
          app.globalData.username = that.data.username;
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
  bindUserName(e){
    this.setData({
      username: e.detail.value
    })
  }
})