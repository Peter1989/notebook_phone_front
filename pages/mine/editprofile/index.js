// pages/mine/editprofile/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '新用户',
    sex: 1,
    city: '',
    profile: '',
    region: ['北京市', '北京市', '东城区'],
    headpic: '',
    sexarray: ['男', '女']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  uploadInfo: function(data){
    wx.request({
      url: 'https://www.funyang.top/minipro/user/uploadinfo',
      data: data,
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        console.log(res);
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
    if (app.globalData.hasLogin) {
      var globaldata = app.globalData;
      var tail = globaldata.profile.length > 8 ? '...' : '';
      this.setData({
        headpic: globaldata.headpic || '../../../assets/defaultheadpic.png',
        username: globaldata.username || this.data.username,
        sex: globaldata.sex || 1,
        city: globaldata.district.split(',')[2] || '未填写',
        profile: globaldata.profile.slice(0, 8)+tail,
        region: globaldata.district.split(',') || this.data.region
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
  chooseImage() {
    // 让用户选择一张图片
    wx.chooseImage({
      success: chooseResult => {
        wx.showLoading({title: '正在上传'})
        // 将图片上传至云存储空间
        var filepath = 'headpic/' + app.globalData.uid + '_' + Date.parse(new Date()) +'_headpic.png';
        var that = this;
        var oriheadpic = that.data.headpic;

        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: filepath,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFilePaths[0],
          // 成功回调
          success: res => {
            that.setData({
              headpic: res.fileID
            })
            wx.hideLoading();
            console.log('上传成功', res.fileID);
            that.uploadInfo({ headpic: res.fileID });
            app.globalData.headpic = that.data.headpic;
          },
        })

        if(oriheadpic.slice(0,5) === 'cloud'){
          wx.cloud.deleteFile({
            fileList: [oriheadpic],
            success: res => {
              console.log('删除成功', res.fileList);
            },
            fail: console.error
          })
        }
      },
    })
  },
  onGotUserInfo: function(e){
    var oriheadpic = this.data.headpic;
    var userInfo = e.detail.userInfo;
    console.log(e.detail.userInfo);
    var data = {
      username: userInfo.nickName,
      headpic: userInfo.avatarUrl,
      sex: userInfo.gender
    }
    this.uploadInfo(data);
    this.setData({
      username: userInfo.nickName,
      headpic: userInfo.avatarUrl,
      sex: userInfo.gender
    })
    app.globalData.headpic = userInfo.avatarUrl;
    if (oriheadpic.slice(0, 5) === 'cloud') {
      wx.cloud.deleteFile({
        fileList: [oriheadpic],
        success: res => {
          console.log('删除成功', res.fileList);
        },
        fail: console.error
      })
    }
  },
  bindRegionChange: function (e) {
    var res = e.detail.value
    this.setData({
      region: res,
      city: res[2]
    })
    var data = {
      district: res.join(',')
    }
    this.uploadInfo(data);
    app.globalData.district = res.join(',');
  },
  bindPickerChange: function(e){
    var res = Number(e.detail.value) + 1
    console.log(res);
    this.setData({
      sex: res
    })
    this.uploadInfo({sex: res});
    app.globalData.sex = res;
  },
  logout: function(e){
    wx.clearStorage()
    app.globalData.token = '';
    app.globalData.hasLogin = false;
    app.globalData.headpic = '';
    app.globalData.username = '';
    this.setData({
      username: '新用户',
      sex: 1,
      city: '',
      profile: '',
      headpic: ''
    })
    wx.navigateBack({
      delta: 1
    })
  }
})