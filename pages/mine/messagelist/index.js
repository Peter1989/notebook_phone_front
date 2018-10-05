// pages/friends/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    size: 10,
    nomore: false,
    friendsList: [1]
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
  fetchData(page){
    if (this.data.nomore && page !== 1) {
      return
    }
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/message/getmessagefriend',
      data: {
        page: page,
        size: that.data.size,
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.list === null || res.data.list.length === 0) {
          that.setData({
            nomore: true
          })
          if (page === 1) {
            that.setData({
              friendsList: []
            })
          }
          return
        }

        res.data.list.map((item) => {
          item.datetime = app.formatStamp(item['timestamp'] * 1000, '/');
          return item;
        })
        console.log('list', res.data.list);
        if (page === 1) {
          that.setData({
            friendsList: res.data.list,
            nomore: false
          })
        } else {
          that.setData({
            friendsList: that.data.friendsList.concat(res.data.list)
          })
        }
        that.data.page++;
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
    this.setData({
      nomore: false
    })
    this.fetchData(1);
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
    this.fetchData(1);
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fetchData(this.data.page);
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
  gotochatroom: function(e){
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: '/pages/mine/messagelist/chatroom/index?uid=' + uid
    })
  },
  gotouser: function(e){
    var uid = e.currentTarget.dataset.uid;
    wx.navigateTo({
      url: "/pages/profile/index?uid="+uid
    })
  }
})