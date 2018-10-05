// pages/mine/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    targetuid: '',
    message: '',
    page: 1,
    size: 10,
    nomore: false,
    messageList: [1]
  },
  fetchData(page) {
    if (this.data.nomore && page !== 1) {
      return
    }
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/message/getmessage',
      data: {
        page: page,
        size: that.data.size,
        targetuid: that.data.targetuid
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
              messageList: []
            })
          }
          return
        }

        res.data.list.map((item) => {
          item.datetime =  app.formatStamp(item['timestamp'] * 1000, '/');
          return item;
        })
        console.log('list',res.data.list);
        if (page === 1) {
          that.setData({
            messageList: res.data.list,
            nomore: false
          })
          //创建节点选择器
          var query = wx.createSelectorQuery();
          //选择id
          query.select('.user-info-wrap').boundingClientRect(function (rect) {
            that.setData({
              height: Number(rect.height * 2) + 'rpx'
            })
          }).exec();
        } else {
          that.setData({
            messageList: that.data.messageList.concat(res.data.list)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = options.uid;
    console.log('chatroom',uid);
    var that = this;
    that.setData({
      targetuid: uid,
      nomore: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.user-info-wrap').boundingClientRect(function (rect) {
      that.setData({
        height: Number(rect.height * 2) + 'rpx'
      })
    }).exec();
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
  sendmessage: function(){
    var that = this;
    if(that.data.message === ''){
      var tilteObj = {
        title: '请您填写私信内容',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return;
    }
    wx.request({
      url: 'https://www.funyang.top/minipro/message/sendmessage',
      data: {
        targetuid: that.data.targetuid,
        message: that.data.message
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if(res.data.success){
          that.fetchData(1);
          that.setData({
            message: ''
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  bindTextinput: function(e){
    this.setData({
      message: e.detail.value
    })
  },
  bindlinechange: function(){
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.user-info-wrap').boundingClientRect(function (rect) {
      that.setData({
        height: Number(rect.height * 2) + 'rpx'
      })
    }).exec();
  },
  delete: function(e){
    var id = e.currentTarget.dataset.id;
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/message/deletemessage',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.success) {
          that.fetchData(1);
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})