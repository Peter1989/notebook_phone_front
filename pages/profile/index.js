// pages/mine/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    userInfo: {},
    uid: '',
    page: 1,
    size: 10,
    nomore:false,
    cardList: [1]
  },
  fetchData(page) {
    if (this.data.nomore) {
      return
    }
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/minipro/cardforprofile',
      data: {
        page: page,
        size: that.data.size,
        targetuid: that.data.uid
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
              cardList: []
            })
          }
          return
        }
        res.data.list.map((item) => {
          item.datetime = app.formatStamp(item['timestamp'] * 1000, '/');
          item.answer_text = [{
            name: 'div',
            children: [{
              type: 'text',
              text: item['answer_text']
            }]
          }]
          return item;
        })
        if (page === 1) {
          that.setData({
            cardList: res.data.list,
            loading: false
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
            cardList: that.data.cardList.concat(res.data.list)
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
    var that = this;
    var uid = options.uid;
    that.setData({uid: uid})
    wx.request({
      url: 'https://www.funyang.top/minipro/user/getuserdetail',
      data: {
        targetuid: uid
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.district){
          var districtArr = res.data.district.split(',');
          var districtStr = districtArr[1] + ' ' + districtArr[2];
          res.data.district = districtStr;
        }
        var followStatus = '';
        console.log(res.data.followed)
        switch(res.data.followed){
          case 0: 
            followStatus = '未关注';
            break;
          case 1: 
            followStatus = '已关注';
            break;
          case 2: 
            followStatus = '被关注';
            break;
          case 3: 
            followStatus = '相互关注';
            break;
        }
        console.log(followStatus)
        res.data.headpic = res.data.headpic || '../../assets/defaultheadpic.png';
        res.data.followStatus = followStatus;
        
        that.setData({
          userInfo: res.data
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
    that.fetchData(1);
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
  handlefollow: function (e) {
    //follow为1、3传0，2、4传1。
    var follow = this.data.userInfo.followed % 2 === 1 ? 0 : 1 ;
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/user/follow',
      data: {
        targetuid: this.data.userInfo.id,
        follow: follow
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.success === true) {
          if (follow === 1) {
            var tmpInfo = that.data.userInfo;
            tmpInfo.followed += 1;
          } else {
            var tmpInfo = that.data.userInfo;
            tmpInfo.followed -= 1;
          }
          var followStatus = '';

          switch (tmpInfo.followed) {
            case 0:
              followStatus = '未关注';
              break;
            case 1:
              followStatus = '已关注';
              break;
            case 2:
              followStatus = '被关注';
              break;
            case 3:
              followStatus = '相互关注';
              break;
          }
          tmpInfo.followStatus = followStatus;

          that.setData({
            userInfo: tmpInfo
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  clickLike(e) {
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var qid = e.currentTarget.id;
    var targetuid = e.currentTarget.dataset.targetuid;
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/minipro/clicklike',
      data: {
        qid: qid,
        like: type,
        targetuid: targetuid
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        var cardListtmp = that.data.cardList;
        if (type == 1) {
          cardListtmp[index].like++;
          cardListtmp[index].has_liked = '1';
        } else {
          cardListtmp[index].like--;
          cardListtmp[index].has_liked = '0';
        }

        //一定要这样设定数据嘛？
        that.setData({ cardList: cardListtmp });
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  gotochatroom(e){
    var uid = e.currentTarget.dataset.uid;
    console.log(uid);
    wx.navigateTo({
      url: "/pages/mine/messagelist/chatroom/index?uid="+uid
    })
  }
})