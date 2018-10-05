// pages/mine/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headpic: '',
    username: '',
    levelThreeArr: [1]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
    if(app.globalData.hasLogin){
      app.getUserInfo();
    }
    this.setData({
      headpic: app.globalData.headpic || '../../../assets/defaultheadpic.png',
      username: app.globalData.username || (app.globalData.hasLogin? '新用户' : '未登录')
    })
    
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/tag/gettags',
      data: {
        level: 'all'
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        that.setData({
          levelThreeArr: res.data.tagsThree
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
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

  gotoeditprofile : function(){
    var res = this.checklogin();
    if(res){
      wx.navigateTo({
        url: "/pages/mine/editprofile/index"
      })
    }
  },
  gotoaddcard: function(){
    var res = this.checklogin();
    if (res) {
      wx.navigateTo({
        url:"./addcard/index"
      })
    }
  },
  gotoaddmarked: function(){
    var res = this.checklogin();
    if (res) {
      wx.navigateTo({
        url: "./marked/index"
      })
    }
  },
  gotolikedme: function(){
    var res = this.checklogin();
    if(res){
      wx.navigateTo({
        url: "./likedme/index"
      })
    }
  },
  gototag: function(){
    var res = this.checklogin();
    if (res) {
      wx.navigateTo({
        url: "./taglist/index"
      })
    }
  },
  gotomessagelist(){
    var res = this.checklogin();
    if (res) {
      wx.navigateTo({
        url: "./messagelist/index"
      })
    }
  },
  gotofeedback() {
    var res = this.checklogin();
    if (res) {
      wx.navigateTo({
        url: "/pages/feedback/index"
      })
    }
  },
  checklogin: function(){
    if (!app.globalData.hasLogin) {
      var tilteObj = {
        title: '请您先登录',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return false;
    }
    return true;
  }

  
})