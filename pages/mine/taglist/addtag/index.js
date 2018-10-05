// pages/tag/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    isEdit: false,
    tagName: '',
    uplevelid: 0,
    currleveloneid: 0,
    currleveltwoid: 0,
    currClass: '',
    multiArr: [],
    multiIndex: [0, 0],
    levelOneArr: [],
    levelTwoArr: []
  },
  test(item){
    console.log(this)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    var levelonetext;
    var leveltwotext;
    var indexOne;
    var indexTwo;
    
    wx.request({
      url: 'https://www.funyang.top/minipro/tag/gettags',
      data: {
        level: 'two'
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        
        if (options.id) {
          var currleveloneid = options.leveloneid;
          var currleveltwoid = options.leveltwoid;
          
          res.data.tagsOne.filter((item, index, array) => {
            if (item.id === currleveloneid){
              levelonetext = item.tagname;
              indexOne = index;
              return true;
            }
          });
          var columnTwo = res.data.tagsTwo.filter((item, index, array) => {
            var uplevelid = currleveloneid;
            return item.uplevelid === uplevelid;
          });
          columnTwo.filter((item, index, array) => {
            if(item.id === currleveltwoid){
              leveltwotext = item.tagname;
              indexTwo = index;
              return true;
            }
          })

          var multiArr = [];
          multiArr.push(res.data.tagsOne);
          multiArr.push(columnTwo);

          that.setData({
            tagName: options.levelthreetext,
            multiIndex: [indexOne, indexTwo],
            currClass: levelonetext + '>' + leveltwotext,
            multiArr: multiArr,
            levelTwoArr: res.data.tagsTwo,
            levelOneArr: res.data.tagsOne,
            currleveltwoid: currleveltwoid,
            currleveloneid: currleveloneid,
            isEdit: true,
            id: options.id
          })
        }else{
          if (!res.data.tagsOne || res.data.tagsOne.length === 0){
            return;
          }
          that.setData({
            currleveloneid: res.data.tagsOne[0].id
          })
          var columnTwo = res.data.tagsTwo.filter((item, index, array) => {
            var uplevelid = that.data.currleveloneid;
            return item.uplevelid === uplevelid;
          });
          var multiArr = [];
          multiArr.push(res.data.tagsOne);
          multiArr.push(columnTwo);

          that.setData({
            multiArr: multiArr,
            levelTwoArr: res.data.tagsTwo,
            levelOneArr: res.data.tagsOne
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
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

  radioChange(e){
    this.setData({
      level: e.detail.value
    })
  },
  submit(){
    if(!this.data.tagName){
      var tilteObj = {
        title: '请填写标签名',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return;
    }
    if (!this.data.currleveltwoid){
      var tilteObj = {
        title: '请先添加和选择标签分类',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return;
    }
    if(this.data.isEdit){
      wx.request({
        url: 'https://www.funyang.top/minipro/tag/edittag',
        data: {
          level: 'three',
          tag_name: this.data.tagName,
          uplevelid: this.data.currleveltwoid,
          id: this.data.id
        },
        header: {
          'content-type': 'application/json',
          'aid': app.globalData.token
        },
        success: function (res) {
          if (res.data.success) {
            var tilteObj = {
              title: '编辑成功',
              icon: 'success'
            }
            wx.showToast(tilteObj);
            wx.navigateBack({
              delta: 1
            })
          } else {
            var tilteObj = {
              title: '编辑失败',
              icon: 'none'
            }
            wx.showToast(tilteObj);
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }else{
      wx.request({
        url: 'https://www.funyang.top/minipro/tag/addtag',
        data: {
          level: 'three',
          tag_name: this.data.tagName,
          uplevelid: this.data.currleveltwoid
        },
        header: {
          'content-type': 'application/json',
          'aid': app.globalData.token
        },
        success: function (res) {
          if(res.data.success){
            var tilteObj = {
              title: '提交成功',
              icon: 'success'
            }
            wx.showToast(tilteObj);
            wx.navigateBack({
              delta: 1
            })
          }else{
            var tilteObj = {
              title: '请检查是否重复提交',
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
  },
  bindTagName(e){
    this.setData({
      tagName: e.detail.value
    })
  },
  bindPickerChange(e){
    var index = e.detail.value;
    var uplevelid = this.data.array[index].id;
    var levelOneName = this.data.array[index].tagname;
    this.setData({
      uplevelid: uplevelid,
      levelOneName: levelOneName
    })
  },
  bindColumnChange(e){
    var that = this;
    if(e.detail.column === 0){
      var index = e.detail.value;
      var currentleveloneid = that.data.levelOneArr[index].id;
      that.setData({
        currleveloneid: currentleveloneid
      })

      var columnTwo = that.data.levelTwoArr.filter((item, index, array) => {
        var uplevelid = that.data.currleveloneid;
        console.log(uplevelid, that.data.currleveloneid);
        return item.uplevelid === uplevelid;
      });

      var multiArr = that.data.multiArr;
      multiArr[1] = columnTwo;
      that.setData({
        multiArr: multiArr
      })
    }
  },
  bindPickerChange(e){
    var multiIndex = e.detail.value
    var levelOneClass = this.data.multiArr[0][multiIndex[0]].tagname;
    var levelTwoClass = this.data.multiArr[1][multiIndex[1]].tagname;
    var classTwoId = this.data.multiArr[1][multiIndex[1]].id;

    this.setData({
      multiIndex: multiIndex,
      currClass: levelOneClass+' > '+levelTwoClass,
      currleveltwoid: classTwoId
    })
  }
})