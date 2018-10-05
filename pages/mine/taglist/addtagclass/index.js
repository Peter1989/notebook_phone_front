// pages/tag/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: 'one', value: '一级分类', checked: 'true' },
      { name: 'two', value: '二级分类' }
    ],
    array: [],
    level: 'one',
    tagName: '',
    uplevelid: 0,
    levelOneName: '',
    isEdit: false,
    id: '',
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/tag/gettags',
      data: {
        level: 'one'
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if(!res.data.tagsOne || res.data.tagsOne.length === 0){
          return;
        }
        that.setData({
          array: res.data.tagsOne
        })
        //如果是编辑，获取分类名称
        if (options.id) {
          console.log(options)
          if (options.level === 'one'){
            var classdetail = that.data.array.filter((item, index, array) => {
              return item.id === options.id;
            });
            that.setData({ 
              level: 'one', 
              tagName: classdetail[0].tagname,
              isEdit: true,
              id: options.id
            })
            console.log(that.data)
          }else{
            var classdetail = that.data.array.filter((item, index, array) => {
              if(item.id === options.leveloneid){
                that.setData({
                  index: index
                })
                return true;
              }
            });
            console.log(classdetail);
            that.setData({
              level: 'two',
              levelOneName: classdetail[0].tagname,
              uplevelid: options.leveloneid,
              tagName: options.leveltwotext,
              isEdit: true,
              id: options.id
            })
          }
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
        title: '请填写分类名',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return;
    }
    if(this.data.isEdit === false){
      wx.request({
        url: 'https://www.funyang.top/minipro/tag/addtag',
        data: {
          level: this.data.level,
          tag_name: this.data.tagName,
          uplevelid: this.data.uplevelid
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
    }else{
      wx.request({
        url: 'https://www.funyang.top/minipro/tag/edittag',
        data: {
          id: this.data.id,
          level: this.data.level,
          tag_name: this.data.tagName,
          uplevelid: this.data.uplevelid
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
  }
})