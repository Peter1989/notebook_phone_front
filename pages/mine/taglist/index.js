// pages/tag/index.js

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    levelOneArr: [1],
    levelTwoArr: [1],
    levelThreeArr: [1],
    columnTwo: [],
    columnThree: [],
    currleveloneid: '',
    currleveltwoid: '',
    currlevelthreeid: '',
    currlevelonetext: '',
    currleveltwotext: '',
    currlevelthreetext: '',
    value: [0, 0, 0]
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
    this.initTags();
  },
  initTags: function(){
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
        if (!res.data.tagsOne || res.data.tagsOne.length === 0) {
          that.setData({
            levelOneArr: [],
            levelTwoArr: [],
            levelThreeArr: []
          })
          return;
        }
        that.setData({
          levelOneArr: res.data.tagsOne,
          levelTwoArr: res.data.tagsTwo,
          levelThreeArr: res.data.tagsThree,
        })
        that.renewtags();
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  renewtags: function () {
    var that = this;
    if (that.data.levelOneArr.length === 0) {
      return;
    }
    var currleveloneid = that.data.levelOneArr[0].id;
    var currlevelonetext = that.data.levelOneArr[0].tagname;
    var columnTwo = that.data.levelTwoArr.filter((item, index, array) => {
      var uplevelid = currleveloneid;
      return item.uplevelid === uplevelid;
    });

    if (!columnTwo || columnTwo.length === 0){
      that.setData({
        columnTwo: [],
        columnThree: [],
        currleveloneid: currleveloneid,
        currleveltwoid: '',
        currlevelthreeid: '',
        currlevelthreetext: '',
        currleveltwotext: '',
        value: [0, 0, 0]
      })
    }

    var currleveltwoid = columnTwo[0].id;
    var currleveltwotext = columnTwo[0].tagname;
    var columnThree = that.data.levelThreeArr.filter((item, index, array) => {
      var uplevelid = currleveltwoid;
      return item.uplevelid === uplevelid;
    });

    if (!columnThree || columnThree.length === 0) {
      that.setData({
        columnThree: [],
        currleveloneid: currleveloneid,
        currleveltwoid: currleveltwoid,
        currlevelthreeid: '',
        currlevelthreetext: '',
        value: [0, 0, 0]
      })
    }
    var currlevelthreetext = columnThree[0].tagname;
    that.setData({
      columnTwo: columnTwo,
      columnThree: columnThree,
      currleveloneid: currleveloneid,
      currleveltwoid: currleveltwoid,
      currlevelthreeid: columnThree[0].id,
      currlevelonetext: currlevelonetext,
      currleveltwotext: currleveltwotext,
      currlevelthreetext: currlevelthreetext,
      value: [0, 0, 0]
    })
  },
  bindChange(e) {
    console.log(e)
    var that = this;
    if (e.detail.value[0] !== that.data.value[0]) {
      var index = e.detail.value[0];
      var currentleveloneid = that.data.levelOneArr[index].id;
      var currentlevelonetext = that.data.levelOneArr[index].tagname;
      that.setData({
        currleveloneid: currentleveloneid,
        currlevelonetext: currentlevelonetext,
        value: [index, 0, 0]
      })

      var columnTwo = that.data.levelTwoArr.filter((item, index, array) => {
        var uplevelid = that.data.currleveloneid;
        return item.uplevelid === uplevelid;
      });

      if (columnTwo.length === 0) {
        that.setData({
          columnTwo: [],
          columnThree: [],
          currleveltwoid: '',
          currlevelthreeid: '',
          currleveltwotext: '',
          currlevelthreetext: ''
        })
        return;
      }

      var currentleveltwoid = columnTwo[0].id;
      var currentleveltwotext = columnTwo[0].tagname;
      that.setData({
        currleveltwoid: currentleveltwoid,
        currleveltwotext: currentleveltwotext,
        columnTwo: columnTwo      
      })

      var columnThree = that.data.levelThreeArr.filter((item, index, array) => {
        var uplevelid = that.data.currleveltwoid;
        return item.uplevelid === uplevelid;
      });

      if (columnThree.length === 0) {
        that.setData({
          columnThree: [],
          currlevelthreeid: '',
          currlevelthreetext: ''
        })
        return;
      }

      that.setData({
        columnThree: columnThree,
        currlevelthreeid: columnThree[0].id,
        currlevelthreetext: columnThree[0].tagname
      })

    } else if (e.detail.value[1] !== that.data.value[1]) {
      var index = e.detail.value[1];
      var value = this.data.value;
      value[2] = 0;
      value[1] = e.detail.value[1];
      var currentleveltwoid = that.data.columnTwo[index].id;
      var currentleveltwotext = that.data.columnTwo[index].tagname;
      that.setData({
        currleveltwoid: currentleveltwoid,
        currleveltwotext: currentleveltwotext,
        value: value
      })
      var columnThree = that.data.levelThreeArr.filter((item, index, array) => {
        var uplevelid = that.data.currleveltwoid;
        return item.uplevelid === uplevelid;
      });
      if (columnThree.length === 0) {
        that.setData({
          columnThree: [],
          currlevelthreeid: '',
          currlevelthreetext: ''
        })
        return;
      }

      var currentlevelthreeid = columnThree[0].id;
      var currentlevelthreetext = columnThree[0].tagname;
      that.setData({
        columnThree: columnThree,
        currlevelthreeid: currentlevelthreeid,
        currlevelthreetext: currentlevelthreetext
      })
    } else if (e.detail.value[2] !== that.data.value[2]){
      var index = e.detail.value[2];
      var value = this.data.value;
      value[2] = index;
      var currentlevelthreeid = that.data.columnThree[index].id;
      var currentlevelthreetext = that.data.columnThree[index].tagname;
      that.setData({
        currlevelthreeid: currentlevelthreeid,
        currlevelthreetext: currentlevelthreetext,
        value: value
      })
    }
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
  edit: function(e){
    var id = e.target.dataset.id;
    var level = e.target.dataset.level;
    console.log(level);
    if(level === 'one'){
      wx.navigateTo({
        url: '/pages/mine/taglist/addtagclass/index?id=' + id + '&level=' + level
      })
    }else if(level === 'two'){
      var leveloneid = e.target.dataset.leveloneid;
      var leveltwotext = e.target.dataset.leveltwotext;
      wx.navigateTo({
        url: '/pages/mine/taglist/addtagclass/index?id=' + id + '&level=' + level + '&leveloneid=' + leveloneid + '&leveltwotext=' + leveltwotext
      })
    }else if(level === 'three'){
      var leveltwoid = e.target.dataset.leveltwoid;
      var leveloneid = e.target.dataset.leveloneid;
      var levelthreetext = e.target.dataset.levelthreetext;
      wx.navigateTo({
        url: '/pages/mine/taglist/addtag/index?id=' + id + '&level=' + level + '&leveltwoid=' + leveltwoid + '&leveloneid=' + leveloneid + '&levelthreetext=' + levelthreetext
      })
    }
  },
  delete: function(e){
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/tag/deletetag',
      data: {
        level: e.target.dataset.level,
        id: e.target.dataset.id
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if(res.data.success){
          that.initTags();
        }else{
          var tilteObj = {
            title: '删除失败',
            icon: 'none'
          }
          wx.showToast(tilteObj);
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})