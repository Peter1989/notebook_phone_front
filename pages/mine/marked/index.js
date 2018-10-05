// pages/mycards/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagIndex: [0, 0, 0],
    tagbarone: '全部标签',
    tagbartwo: '',
    tagbarthree: '',
    items: [
      { name: 'stadying', value: '学习中', checked: true },
      { name: 'master', value: '已掌握'},
      { name: 'all', value: '全部状态' }
    ],
    status: 'stadying',
    searchText: '',
    multiArr:[],
    levelOneArr: [],
    levelTwoArr:[],
    levelThreeArr: [],
    currleveloneid: '',
    currleveltwoid: '',
    currlevelthreeid: '',
    ifalltags: true,
    cardList: [],
    page: 1,
    size: 10,
    loading: false,
    nomore: false,
    startX: '',
    editIndex: 0,
    delBtnWidth: 118
  },
  fetchData(page) {
    if (this.data.nomore || this.data.levelOneArr.length === 0) {
      return
    }
    var tag = '';
    console.log(!this.data.ifalltags && this.data.currlevelthreeid === '')
    if (!this.data.ifalltags && this.data.currlevelthreeid === ''){
      return;
    } else if (this.data.ifalltags){
      tag = 'all';
    } else {
      tag = this.data.currlevelthreeid;
    }
    var that = this;

    wx.request({
      url: 'https://www.funyang.top/minipro/minipro/marked',
      data: {
        page: page,
        size: that.data.size,
        search_text: that.data.searchText,
        tag: tag,
        status: that.data.status
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        console.log(res.data);

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
          item.txtStyle = 'left:0rpx';
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
        } else {
          console.log('list', res.data.list);
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
          levelOneArr: res.data.tagsOne,
          levelTwoArr: res.data.tagsTwo,
          levelThreeArr: res.data.tagsThree,
          nomore: false
        })
        that.renewtags();
        that.fetchData(1);
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  renewtags: function(){
    var that = this;
    if (that.data.levelOneArr.length === 0){
      return;
    }
    var currleveloneid = that.data.levelOneArr[0].id;
    var columnTwo = that.data.levelTwoArr.filter((item, index, array) => {
      var uplevelid = currleveloneid;
      return item.uplevelid === uplevelid;
    });
    that.setData({
      currleveltwoid: columnTwo[0].id
    })
        var columnThree = that.data.levelThreeArr.filter((item, index, array) => {
      var uplevelid = that.data.currleveltwoid;
      return item.uplevelid === uplevelid;
    });

    var multiArr = [];
    multiArr.push(that.data.levelOneArr);
    multiArr.push(columnTwo);
    multiArr.push(columnThree);

    that.setData({
      multiArr: multiArr
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

  tagBindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var indexs = e.detail.value;
    var multiArr = this.data.multiArr;
    this.setData({
      tagbarone: (multiArr[0][indexs[0]] && multiArr[0][indexs[0]].tagname) || '',
      tagbartwo: (multiArr[1][indexs[1]] && multiArr[1][indexs[1]].tagname) || '' ,
      tagbarthree: (multiArr[2][indexs[2]] && multiArr[2][indexs[2]].tagname) || '',
      currlevelthreeid: (multiArr[2][indexs[2]] && multiArr[2][indexs[2]].id) || '',
      nomore: false,
      ifalltags: false
    })
    if (!this.data.currlevelthreeid){
      var tilteObj = {
        title: '请选择有效标签',
        icon: 'none'
      }
      wx.showToast(tilteObj);
    }
    this.fetchData(1);
  },
  bindColumnChange(e) {
    var that = this;
    if (e.detail.column === 0) {
      var index = e.detail.value;
      var currentleveloneid = that.data.levelOneArr[index].id;
      var tagIndex = that.data.tagIndex;
      tagIndex = [index, 0, 0];
      that.setData({
        currleveloneid: currentleveloneid,
        tagIndex: tagIndex
      })
      var columnTwo = that.data.levelTwoArr.filter((item, index, array) => {
        var uplevelid = that.data.currleveloneid;
        return item.uplevelid === uplevelid;
      });
      if(columnTwo.length === 0){
        var columnTwo = [];
        var columnThree = [];
        var multiArr = that.data.multiArr;
        multiArr[1] = columnTwo;
        multiArr[2] = columnThree;
        that.setData({
          multiArr: multiArr,
          currleveltwoid: '',
          currlevelthreeid: ''
        })
        return;
      }

      var currentleveltwoid = columnTwo[0].id;
      that.setData({
        currleveltwoid: currentleveltwoid,
      })
      
      var columnThree = that.data.levelThreeArr.filter((item, index, array) => {
        var uplevelid = that.data.currleveltwoid;
        return item.uplevelid === uplevelid;
      });

      if (columnThree.length === 0) {
        var columnThree = [];
        var multiArr = that.data.multiArr;
        multiArr[2] = columnThree;
        that.setData({
          multiArr: multiArr,
          currlevelthreeid: ''
        })
        return;
      }

      var multiArr = that.data.multiArr;
      multiArr[1] = columnTwo;
      multiArr[2] = columnThree;
      that.setData({
        multiArr: multiArr
      })
    } else if(e.detail.column === 1) {
      var index = e.detail.value;
      var tagIndex = this.data.tagIndex;
      tagIndex[1] = index;
      tagIndex[2] = 0;
      var currentleveltwoid = that.data.multiArr[1][index].id;
      that.setData({
        currleveltwoid: currentleveltwoid,
        tagIndex: tagIndex
      })
      var columnThree = that.data.levelThreeArr.filter((item, index, array) => {
        var uplevelid = that.data.currleveltwoid;
        return item.uplevelid === uplevelid;
      });
      if (columnThree.length === 0) {
        var columnThree = [];
        var multiArr = that.data.multiArr;
        multiArr[2] = columnThree;
        that.setData({
          multiArr: multiArr,
          currlevelthreeid: ''
        })
        return;
      }

      var currentlevelthreeid = columnThree[0].id;
      var multiArr = that.data.multiArr;
      multiArr[2] = columnThree;
      that.setData({
        multiArr: multiArr,
        currlevelthreeid: currentlevelthreeid
      })
    }
  },
  radioChange: function (e) {
    console.log('radioChange', e.detail.value);
    this.setData({
      status: e.detail.value,
      nomore: false,
      page: 1,
      loading: true
    })

    this.fetchData(1);
  },
  //显示个人介绍浮窗
  handleauthor: function (e) {
    var index = e.target.id;
    console.log(index)
  },
  handleshow: function (e) {
    var index = e.currentTarget.id;
    var cardList1 = this.data.cardList;
    cardList1[index].show = !cardList1[index].show;
    this.setData({ cardList: cardList1 })
  },
  bindinput: function(e){
    this.setData({
      searchText: e.detail.value,
      nomore: false
    })
    this.fetchData(1);
  },
  alltags: function(e){
    this.setData({
      ifalltags: true,
      tagbarone: '全部标签',
      tagbartwo: '',
      tagbarthree: '',
      currleveloneid: '',
      currleveltwoid: '',
      currlevelthreeid: '',
      tagIndex: [0, 0, 0],
      nomore: false
    })
    this.renewtags();
    this.fetchData(1);
  },
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  //手指刚放到屏幕触发
  touchS: function (e) {
    console.log("touchS",e);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    console.log("touchM:", e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.cardList;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        cardList: list
      });
    }
  },
  touchE: function (e) {
    console.log("touchE", e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.cardList;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      that.setData({
        cardList: list
      });
    }
  },
  handledelete: function(e){
    var that = this;
    var qid = e.target.dataset.qid;
    var index = e.target.dataset.id;
    var list = this.data.cardList;

    //发送删除请求，删掉此条知识点
    wx.request({
      url: 'https://www.funyang.top/minipro/minipro/deletequestion',
      data: {
        qid: qid
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.success) {
          list.splice(index, 1);
          //更新列表的状态
          that.setData({
            cardList: list
          });
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  changeStatus: function(e){
    var that = this;
    var index = e.currentTarget.id;
    var list = this.data.cardList;
    var qid = list[index].id;
    var newStatus = list[index].status === '1' ? '0' : '1';
    
    wx.request({
      url: 'https://www.funyang.top/minipro/minipro/changestatus',
      data: {
        qid: qid,
        new_status: newStatus
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if(res.data.success){
          list[index].status = newStatus;
          //更新列表的状态
          that.setData({
            cardList: list
          });
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  starMark: function(e){
    console.log(e);
    var that = this;
    var index = e.currentTarget.id;
    var list = this.data.cardList;
    var qid = list[index].id;
    var newMark = list[index].mark === '1' ? '0' : '1';

    wx.request({
      url: 'https://www.funyang.top/minipro/minipro/submitmark',
      data: {
        qid: qid,
        mark: newMark
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.success) {
          list[index].mark = newMark;
          //更新列表的状态
          that.setData({
            cardList: list
          });
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  goedit: function(e){
    var qid = e.currentTarget.dataset.qid;
    wx.navigateTo({
      url: '/pages/mine/addcard/index?qid='+ qid
    })
  }
})