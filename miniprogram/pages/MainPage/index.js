/* Main page of the app */
Page({
  // 允许接收服务通知
  async requestSubscribeMessage() {
      const templateId = 'e7R2g3YflelgU4llEjEg3AiY4tceHXwlI93LblyCkls'; // 填入你自己想要的模板ID
      wx.requestSubscribeMessage({
          tmplIds: [templateId],
          success: (res) => {
              if (res[templateId] === 'accept') {
                  this.setData({
                      requestSubscribeMessageResult: '成功',
                      isSubscribed: true // 更新订阅状态为已订阅
                  });
              } else {
                  this.setData({
                      requestSubscribeMessageResult: `失败（${res[templateId]}）`,
                  });
              }
          },
          fail: (err) => {
              this.setData({
                  requestSubscribeMessageResult: `失败（${JSON.stringify(err)}）`,
              });
          },
      });
  },
  
  data: {
      screenWidth: 1000,
      screenHeight: 1000,

      creditA: 0,
      creditB: 0,
      userA: '',
      userB: '',
      days: 0,  // 初始化 days
      date: '2024-08-10',

      isSubscribed: false ,// 初始化订阅状态为未订阅

      _openidA : getApp().globalData._openidA,
      _openidB : getApp().globalData._openidB,

      search: "",

      allMemos: [],
      unfinishedMemos: [],
      finishedMemos: [],

      from: '',
      to: '',

      slideButtons: [
        {extClass: 'markBtn', text: '标记', src: "../slideview/Images/icon_mark.svg"},
        {extClass: 'starBtn', text: '星标', src: "../slideview/Images/icon_star.svg"},
        {extClass: 'removeBtn', text: '删除', src: '../slideview/Images/icon_del.svg'}
      ],
  },

  async onShow() {
      this.getCreditA();
      this.getCreditB();
      this.setData({
          userA: getApp().globalData.userA,
          userB: getApp().globalData.userB,
      });
      this.getDays();
      await wx.cloud.callFunction({name: 'getList', data: {list: getApp().globalData.collectionMemoList}}).then(data => {
        this.setData({allMemos: data.result.data})
        this.filterMemo()
        this.getScreenSize()

      })
  },
  //获取页面大小
  async getScreenSize(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        })
      }
    })
  },
  async toDetailPage(element, isUpper) {
    const memoIndex = element.currentTarget.dataset.index
    const memo = isUpper ? this.data.unfinishedMemos[memoIndex] : this.data.finishedMemos[memoIndex]
    wx.navigateTo({url: '../MemoDetail/index?id=' + memo._id})
  },
  //转到任务详情[上]
  async toDetailPageUpper(element) {
    this.toDetailPage(element, true)
  },  
  //转到任务详情[下]
  async toDetailPageLower(element) {
    this.toDetailPage(element, false)
  },
  //转到添加任务
  async toAddPage() {
    wx.navigateTo({url: '../MemoAdd/index'})
  },
    //将待办划分为：完成，未完成
    filterMemo(){
      let memoList = []
      memoList = this.data.allMemos
  
      this.setData({
        unfinishedMemos: memoList.filter(item => item.available === true),
        finishedMemos: memoList.filter(item => item.available === false),
      })
    },

    //响应左划按钮事件[上]
  async slideButtonTapUpper(element) {
    this.slideButtonTap(element, true)
  },

  //响应左划按钮事件[下]
  async slideButtonTapLower(element) {
    this.slideButtonTap(element, false)
  },

    //响应左划按钮事件逻辑
  async slideButtonTap(element, isUpper){
    //得到UI序号
    const {index} = element.detail

    //根据序号获得任务
    const memoIndex = element.currentTarget.dataset.index
    const memo = isUpper === true ? this.data.unfinishedMemos[memoIndex] : this.data.finishedMemos[memoIndex]

    if (index === 0) {
      if(isUpper) {
          this.finishMemo(element)
      }else{
          wx.showToast({
              title: '任务已经完成',
              icon: 'error',
              duration: 2000
          })
      }
  }
  //处理星标按钮点击事件
    if (index === 1) {
                wx.cloud.callFunction({name: 'editStar', data: {_id: memo._id, list: getApp().globalData.collectionMemoList, value: !memo.star}})
                //更新本地数据
                memo.star = !memo.star
            }
      
    //处理删除按钮点击事件
    if (index === 2) {
      wx.cloud.callFunction({name: 'deleteElement', data: {_id: memo._id, list: getApp().globalData.collectionMemoList}})
      //更新本地数据
      if(isUpper) this.data.unfinishedMemos.splice(memoIndex, 1) 
      else this.data.finishedMemos.splice(memoIndex, 1) 
      //如果删除完所有事项，刷新数据，让页面显示无事项图片
      if (this.data.unfinishedMemos.length === 0 && this.data.finishedMemos.length === 0) {
          this.setData({
          allMemos: [],
          unfinishedMemos: [],
          finishedMemos: []
          })
      }
  }
  //触发显示更新
  this.setData({finishedMemos: this.data.finishedMemos, unfinishedMemos: this.data.unfinishedMemos})
  },

  //完成待办
  async finishMemo(element) {
    //根据序号获得触发切换事件的待办
    const memoIndex = element.currentTarget.dataset.index
    const memo = this.data.unfinishedMemos[memoIndex]

    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
      //完成待办
      await wx.cloud.callFunction({name: 'editAvailable', data: {_id: memo._id, value: false, list: getApp().globalData.collectionMemoList}})

      //触发显示更新
      memo.available = false
      this.filterMemo()

      //显示提示
      wx.showToast({
          title: '待办完成',
          icon: 'success',
          duration: 2000
      })
    })
  },
  
  getCreditA() {
      wx.cloud.callFunction({
          name: 'getElementByOpenId', 
          data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}
      }).then(res => {
          this.setData({creditA: res.result.data[0].credit});
      });
  },
  
  getCreditB() {
      wx.cloud.callFunction({
          name: 'getElementByOpenId', 
          data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}
      }).then(res => {
          this.setData({creditB: res.result.data[0].credit});
      });
  },

  getDays() {
      var date1 = this.data.date;
      var date2 = new Date();
      
      console.log('开始日期:', date1);  // 输出开始日期，用于调试
      console.log('当前日期:', date2);  // 输出当前日期，用于调试
      
      var timeDiff = date2.getTime() - new Date(date1).getTime();
      console.log('时间差 (毫秒):', timeDiff);  // 输出时间差，用于调试
      
      this.setData({
          days: Math.floor(timeDiff / (24 * 3600 * 1000) + 1)
      });
  },
})
