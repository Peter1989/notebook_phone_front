//app.js
App({
  onLaunch() {
    // 初始化云函数
    wx.cloud.init()

    this.getToken();
    if (this.globalData.hasLogin) {
      this.getUserInfo();
    }
  },

  globalData: {
    token: '',
    hasLogin: false,
    username: '',
    profile: '',
    sex: 1,
    headpic: '',
    district: '',
    uid: ''
  },

  getToken() {
    var value = this.globalData.token
    if (!value) {
      try {
        var token = wx.getStorageSync('token')
        if (!token) {
            this.globalData.hasLogin = false;
        } else {
            this.globalData.token = token;
            this.globalData.hasLogin = true;
        }
      } catch (e) {
          this.globalData.hasLogin = false;
      }
    } else {
        this.globalData.token = value;
        this.globalData.hasLogin = true;
    }
  },
  getUserInfo(){
    var that = this;
    wx.request({
      url: 'https://www.funyang.top/minipro/user/getselfinfo',
      data: {},
      header: {
        'content-type': 'application/json',
        'aid': that.globalData.token
      },
      success: function (res) {
        var data = res.data;
        that.globalData.username = data.username;
        that.globalData.sex = data.sex;
        that.globalData.headpic = data.headpic;
        that.globalData.profile = data.profile;
        that.globalData.district = data.district;
        that.globalData.uid = data.id;
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  formatTime(date, sign = '.'){
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(this.formatNumber).join(sign) + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  formatNumber(n){
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  formatStamp(stamp, sing){
    const date = new Date(Number(stamp));
    return this.formatTime(date, sing);
  }
})