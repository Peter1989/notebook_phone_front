// pages/index/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: true,
    activeType: 0,
    searchText: '',
    searchType: 'content',
    nomore: false,
    userInfo: {},
    showSearchWrap: false,
    showLogin: true,
    showSignup: false,
    showTips:false,
    tips: '',
    countDownNum: 60,
    showCountDown: false,
    timer: '',
    loginway: 'password',
    loginShowPassword: true,
    signupPhone: '',
    signupCode: '',
    signupPassword: '',
    signupPasswordAgain: '',
    loginPhone: '',
    loginPassword: '',
    loginCode: '',
    cardList:[],
    page: 1,
    size: 10,

    items: [
      { name: 'content', value: '标题和内容', checked: 'true' },
      { name: 'tag', value: '标签' },
    ]
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
    this.setData({
      hasLogin: app.globalData.hasLogin
    })
    this.fetchData(1, this.data.size, 0);
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
    this.fetchData(1, this.data.size, this.data.activeType);
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.fetchData(this.data.page, this.data.size, this.data.activeType);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '闲暇时间消化零散知识，线上互撩的随身忆了解一下？',
      path: '/pages/index/index',
      imageUrl:'https://7465-test-940daf-1257680529.tcb.qcloud.la/demo1.png?sign=03800fadb75c68f5bfda19d44619ef3d&t=1538741837'
    }
  },

  fetchData(page, size, type) {
    if(this.data.nomore){
      return
    }
    var that = this;
    var searchText = this.data.searchText;
    var searchType = this.data.searchType;

    wx.request({
      url: 'https://www.funyang.top/minipro/minipro/groundall',
      data: {
        page: page,
        size: size,
        type: type,
        search_text: searchText,
        search_type: searchType
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.list === null || res.data.list.length === 0){
          that.setData({
            nomore: true
          })
          if(page === 1){
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

        if(page === 1){
          that.setData({
            cardList: res.data.list
          })
        }else{
          console.log('list',res.data.list);
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
  // 设置显示的tab
  setActive: function (e) {
    // 获取当前点击的index
    var index = e.target.dataset.index;
    // 初始化动画数据
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out',
      delay: 0
    })
    // 距离左边位置
    animation.left((index * 187.5) + 'rpx').step()
    // 设置动画
    this.setData({
      animationData: animation.export()
    })
    // 设置对应class
    this.setData({
      activeType: index,
      nomore: false,
      page: 1
    })
    this.fetchData(1, this.data.size, this.data.activeType)
  },
  //显示个人介绍浮窗
  handleauthor: function(e){
    var that = this;
    var uid = e.target.dataset.uid;
    wx.navigateTo({
      url: "/pages/profile/index?uid="+uid
    })
  },

  showLoginInput: function(e){
    this.setData({
      showLogin: true,
      showSignup: false,
    })
  },
  showSignupInput: function (e) {
    this.setData({
      showSignup: true,
      showLogin: false
    })
  },
  getcode: function(e){
    var phone = '';
    if (this.data.showSignup === true){
      phone = this.data.signupPhone;
    }else{
      phone = this.data.loginPhone;
    }

    var res = '';
    var pattern = /^\d{11}$/;
    res = phone.match(pattern);

    let that = this;
    if(res){
      //如果之前触发过tips，去掉tips。
      this.setData({
        showTips: false,
        tips: ''
      })
      wx.request({
        url: 'https://www.funyang.top/minipro/user/sendcode', 
        data: {
          phone: phone
        },
        header: {
          'content-type': 'application/json',
          'aid': app.globalData.token
        },
        success: function (res) {
          console.log(res);
          that.countDown();
          that.setData({
            showCountDown: true
          })
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }else{
      //触发tips
      this.setData({
        showTips: true,
        tips: '请输入正确的手机号'
      })
    }
  },
  bindSignupPhone(e){
    this.setData({
      signupPhone: e.detail.value
    })
  },
  bindSignupCode(e){
    this.setData({
      signupCode: e.detail.value
    })
  },
  bindPassword(e){
    this.setData({
      signupPassword: e.detail.value
    })
  },
  bindPasswordAgain(e){
    this.setData({
      signupPasswordAgain: e.detail.value
    })
  },
  bindLoginPhone(e){
    this.setData({
      loginPhone: e.detail.value
    })
  },
  bindLoginPassword(e){
    this.setData({
      loginPassword: e.detail.value
    })
  },
  bindLoginCode(e){
    this.setData({
      loginCode: e.detail.value
    })
  },
  bindSearchText(e){
    this.setData({
      searchText: e.detail.value,
      nomore: false,
      page: 1
    })
    this.fetchData(1, this.data.size, this.data.activeType)
  },
  //搜标签别忘了nomore先设成false
  countDown: function () {
    let that = this;
    let countDownNum = that.data.countDownNum;//获取倒计时初始值
    console.log(countDownNum);
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: countDownNum
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum == 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，可作其他处理codes go here
          that.setData({
            showCountDown: false,
            countDownNum: 60
          })
        }
      }, 1000)
    })
  },
  signup(){
    var phonepattern = /^\d{11}$/;
    var res = this.data.signupPhone.match(phonepattern);
    var that = this;
    if(!res){
      //触发tips
      that.setData({
        showTips: true,
        tips: '请输入正确的手机号'
      })
      return
    }

    var codepattern = /^\d{6}$/;
    var res = that.data.signupCode.match(codepattern);
    if (!res) {
      //触发tips
      that.setData({
        showTips: true,
        tips: '请输入正确的验证码'
      })
      return
    }

    var signupPassword = that.data.signupPassword.trim();
    var signupPasswordAgain = that.data.signupPasswordAgain.trim();
    
    if (signupPassword !== signupPasswordAgain) {
      //触发tips
      that.setData({
        showTips: true,
        tips: '请确认两次输入的密码是否相同'
      })
      return
    }
    console.log(signupPassword)
    if (signupPassword.length < 6 || signupPassword.length > 20){
      //触发tips
      that.setData({
        showTips: true,
        tips: '请确认密码长度是否正确'
      })
      return
    }

    wx.request({
      url: 'https://www.funyang.top/minipro/user/signup',
      data: {
        phone: that.data.signupPhone,
        code: that.data.signupCode,
        password: signupPassword
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.overtime === true){
          that.setData({
            showTips: true,
            tips: '验证码已过期'
          })
          return
        }else if (res.data.codewrong === true){
          that.setData({
            showTips: true,
            tips: '验证码错误'
          })
          return
        } else if (res.data.datarepeat === true){
          that.setData({
            showTips: true,
            tips: '请不要重复注册'
          })
          return
        }

        wx.setStorage({
          key: "token",
          data: res.data.token
        })

        app.globalData.hasLogin = true;
        that.setData({
          hasLogin: true
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  changeLoginway(){
    let loginway = '';
    if (this.data.loginway === 'password'){
      loginway = 'code';
      this.setData({
        loginway: loginway,
        loginShowPassword: false
      })
    } else if (this.data.loginway === 'code'){
      loginway = 'password';
      this.setData({
        loginway: loginway,
        loginShowPassword: true
      })
    }
  },
  login(){
    var phonepattern = /^\d{11}$/;
    var res = this.data.loginPhone.match(phonepattern);
    var that = this;
    if (!res) {
      //触发tips
      that.setData({
        showTips: true,
        tips: '请输入正确的手机号'
      })
      return
    }
    if (this.data.loginShowPassword === true) {
      var loginPassword = that.data.loginPassword.trim();
      if (loginPassword.length < 6 || loginPassword.length > 20) {
        //触发tips
        that.setData({
          showTips: true,
          tips: '请确认密码是否填写正确'
        })
        return
      }
    }else{
      var loginCode = that.data.loginCode.trim();
      if (loginCode.length !== 6) {
        //触发tips
        that.setData({
          showTips: true,
          tips: '请确认验证码是否填写正确'
        })
        return
      }
    }
    wx.request({
      url: 'https://www.funyang.top/minipro/user/login',
      data: {
        phone: that.data.loginPhone,
        code: that.data.loginCode,
        loginway: this.data.loginway,
        password: loginPassword
      },
      header: {
        'content-type': 'application/json',
        'aid': app.globalData.token
      },
      success: function (res) {
        if (res.data.passwrong === true) {
          that.setData({
            showTips: true,
            tips: '密码错误'
          })
          return
        } else if (res.data.noaccount === true) {
          that.setData({
            showTips: true,
            tips: '账号不存在'
          })
          return
        } else if (res.data.codewrong === true) {
          that.setData({
            showTips: true,
            tips: '验证码错误'
          })
          return
        } else if (res.data.overtime === true) {
          that.setData({
            showTips: true,
            tips: '验证码已过期'
          })
          return
        }

        wx.setStorage({
          key: "token",
          data: res.data.token
        })
        app.globalData.hasLogin = true;
        app.globalData.token = res.data.token;
        that.setData({
          hasLogin: true
        })
        app.getUserInfo();
        console.log(app.globalData)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  clickLike(e){
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
        }else{
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
  radioChange: function (e) {
    this.setData({
      searchType: e.detail.value
    })
    if(this.data.searchText === ''){
      return
    };
    this.fetchData(1, this.data.size, this.data.activeType);
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  startSearch(){
    this.setData({
      showSearchWrap: true
    })
  },
  cancelSearch(){
    this.setData({
      showSearchWrap: false,
      searchType: 'content',
      searchText: '',
    })
    this.fetchData(1, this.data.size, this.data.activeType);
  },
  none(){}
})