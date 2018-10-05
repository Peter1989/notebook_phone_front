// pages/friends/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendsList: [1],
    searchText: '',
    hasLogin: true
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
  fetchData: function(){
    var tail = '';
    var searchText = this.data.searchText;
    if(searchText){
      tail += '?search_text=' + searchText
    }
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/user/getfriends' + tail,
      data: {},
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.success) {
          console.log(res.data.data)
          that.setData({
            friendsList: res.data.data
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //如果没登录，所有状态还原
    if (!app.globalData.hasLogin) {
      this.setData({
        hasLogin: app.globalData.hasLogin,
        friendsList: [],
        searchText: ''
      })
      return;
    }else{
      this.setData({
        hasLogin: true,
      })
    }
    this.fetchData();
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
  following: function(){
    var res = this.checklogin();
    if (res) {
      wx.navigateTo({
        url: "./following/index"
      })
    }
  },
  followed: function(){
    var res = this.checklogin();
    if (res) {
      wx.navigateTo({
        url: "./followed/index"
      })
    }
  },
  checklogin: function () {
    if (!app.globalData.hasLogin) {
      var tilteObj = {
        title: '请您先登录',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return false;
    }
    return true;
  },
  bindinput: function (e) {
    this.setData({
      searchText: e.detail.value,
      nomore: false
    })
    this.fetchData();
  },
})