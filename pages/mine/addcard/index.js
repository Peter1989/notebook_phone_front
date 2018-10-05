// pages/tag/index.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isedit: false,
    isdetail: false,
    qid: '',
    ispublic: true,
    newtag: false,
    newTagText: '',
    title: '',
    content: '',

    classesOne: [],
    classesTwo: [],
    tagsArr: [],

    columnTwo: [],
    columnThree: [],
    multiArr: [],
    multiIndex: [],
    thirdIndex: '',

    classText: '',
    tagText: '',

    currclassoneid: '',
    currclasstwoid: '',
    currtagthreeid: '',

    items: [
      { name: 'exists', value: '选择已有标签', checked: 'true' },
      { name: 'new', value: '新建标签' },
    ],
    privateArr: [
      { name: 'public', value: '公共', checked: true },
      { name: 'self', value: '只对自己可见', checked: false },
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.isdetail === 'true'){
      that.setData({
        isdetail: true
      })
    }
    if (options.qid){
      var qid = options.qid;
      //发送删除请求，删掉此条知识点
      wx.request({
        url: 'https://www.funyang.top/minipro/minipro/getquestion',
        data: {
          qid: qid
        },
        header: {
          'content-type': 'application/json',
          'aid': app.globalData.token
        },
        success: function (res) {
          //to do multiIndex 中是index
          if (res.data.success) {
            that.setData({
              isedit: true,
              qid: options.qid,
              title: res.data.data.question_text,
              content: res.data.data.answer_text,
              currclassoneid: res.data.data.tag_one,
              currclasstwoid: res.data.data.tag_two,
              currtagthreeid: res.data.data.tag,
              ispublic: res.data.data.isprivate === '0'
            })
          }
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
                classesOne: res.data.tagsOne,
                classesTwo: res.data.tagsTwo,
                tagsArr: res.data.tagsThree
              })
              that.renewtags();
            },
            fail: function (res) {
              console.log(res)
            }
          })
        },
        fail: function (res) {
          console.log(res)
        }
      });
    }else{
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
            classesOne: res.data.tagsOne,
            classesTwo: res.data.tagsTwo,
            tagsArr: res.data.tagsThree
          })
          that.renewtags();
        },
        fail: function (res) {
          console.log(res)
        }
      })
      this.renewtags();
    }
  },
  //to do 能不能不在中间setdata
  renewtags: function () {
    var that = this;
    var multiIndex = [];
    var thirdIndex = '';
    var classText = '';
    var tagText = '';

    var columnTwo = that.data.classesTwo.filter((item, index, array) => {
      var uplevelid = that.data.currclassoneid || that.data.classesOne[0].id;
      return item.uplevelid === uplevelid;
    });

    var columnThree = that.data.tagsArr.filter((item, index, array) => {
      var uplevelid = that.data.currclasstwoid || columnTwo[0].id;
      return item.uplevelid === uplevelid;
    });


    that.data.classesOne.forEach((item, index) => {
      if (item.id === (that.data.currclassoneid || that.data.classesOne[0].id)) {
        multiIndex.push(index);
        classText = item.tagname+' > ';
      }
    })

    columnTwo.forEach((item, index) => {
      if (item.id === (that.data.currclasstwoid || columnTwo[0].id)) {
        multiIndex.push(index);
        classText += item.tagname;
      }
    })

    var currtagthreeid;
    columnThree.forEach((item, index) => {
      if (item.id === (that.data.currtagthreeid || columnThree[0].id)) {
        thirdIndex = index;
        tagText = item.tagname;
        currtagthreeid = item.id;
      }
    })

    var multiArr = [];
    multiArr.push(that.data.classesOne);
    multiArr.push(columnTwo);

    that.setData({
      multiArr: multiArr,
      multiIndex: multiIndex,
      thirdIndex: thirdIndex,
      columnTwo: columnTwo,
      columnThree: columnThree,
      classText: classText,
      tagText: tagText,
      currtagthreeid: currtagthreeid
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
  bindMultiPickerColumnChange: function(e){
    var column = e.detail.column;
    var value = e.detail.value;
    if(column === 0){
      var classOneId = this.data.classesOne[value].id;
      var columnTwo = this.data.classesTwo.filter((item, index, array) => {
        return item.uplevelid === classOneId;
      });
      var multiArr = this.data.multiArr;
      multiArr[1] = columnTwo;
      var multiIndex = [value, 0];
      this.setData({
        multiArr: multiArr,
        columnTwo: columnTwo,
        multiIndex: multiIndex
      })
    }
  },
  bindMultiPickerChange: function(e){
    var multiIndex = e.detail.value;
    var currclassoneid = this.data.classesOne[multiIndex[0]].id;
    var currclasstwoid = this.data.columnTwo[multiIndex[1]].id;
    var classText = this.data.classesOne[multiIndex[0]].tagname + ' > ' + this.data.columnTwo[multiIndex[1]].tagname; 
    var columnThree = this.data.tagsArr.filter((item, index, array) => {
      return item.uplevelid === currclasstwoid;
    });

    var thirdIndex = 0;
    if (!columnThree[0]){
      var tilteObj = {
        title: '先为此2级分类添加标签',
        icon: 'none'
      }
      wx.showToast(tilteObj);
      return;
    }

    var tagText = columnThree[0].tagname;
    var currtagthreeid = columnThree[0].id;
    this.setData({
      multiIndex: multiIndex,
      currclassoneid: currclassoneid,
      currclasstwoid: currclasstwoid,
      classText: classText,
      columnThree: columnThree,
      thirdIndex: thirdIndex,
      currtagthreeid: currtagthreeid,
      tagText: tagText
    })
  },
  bindPickerChange: function(e){
    var thirdIndex = e.detail.value;
    var tagText = this.data.columnThree[thirdIndex].tagname;
    var currtagthreeid = this.data.columnThree[thirdIndex].id;
    this.setData({
      thirdIndex: thirdIndex,
      tagText: tagText,
      currtagthreeid: currtagthreeid
    })
  },
  radioChange: function(e){
    this.setData({
      newtag: e.detail.value === 'new'
    })
  },
  privateRadioChange: function(e){
    console.log(e.detail.value === 'public')
    this.setData({
      ispublic: e.detail.value === 'public'
    })
  },
  bindTagInput: function(e){
    this.setData({
      newTagText: e.detail.value
    })
  },
  submit: function(e){
    if (this.data.isedit){
      wx.request({
        url: 'https://www.funyang.top/minipro/question/editquestion',
        data: {
          qid: this.data.qid,
          title: this.data.title,
          content: this.data.content,
          ispublic: this.data.ispublic,
          currclasstwoid: this.data.currclasstwoid,
          newtag: this.data.newtag,
          newTagText: this.data.newTagText,
          currtagthreeid: this.data.currtagthreeid
        },
        header: {
          'content-type': 'application/json',
          'aid': app.globalData.token
        },
        success: function (res) {
          if(res.data.success){
            var tilteObj = {
              title: '编辑成功',
              icon: 'none'
            }
            wx.showToast(tilteObj);
            wx.navigateBack({
              delta: 1
            })
          }else{
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
      console.log(this.data.currtagthreeid);
      wx.request({
        url: 'https://www.funyang.top/minipro/question/addquestion',
        data: {
          title: this.data.title,
          content: this.data.content,
          ispublic: this.data.ispublic,
          currclasstwoid: this.data.currclasstwoid,
          newtag: this.data.newtag,
          newTagText: this.data.newTagText,
          currtagthreeid: this.data.currtagthreeid
        },
        header: {
          'content-type': 'application/json',
          'aid': app.globalData.token
        },
        success: function (res) {
          if (res.data.success) {
            var tilteObj = {
              title: '添加成功',
              icon: 'none'
            }
            wx.showToast(tilteObj);
            wx.navigateBack({
              delta: 1
            })
          } else {
            var tilteObj = {
              title: '添加失败',
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
  titleinput(e){
    var title = e.detail.value;
    this.setData({
      title: title
    })
  },
  contentinput(e){
    var content = e.detail.value;
    this.setData({
      content: content
    })
  }
})