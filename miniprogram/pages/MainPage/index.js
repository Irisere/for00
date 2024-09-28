/* Main page of the app */
Page({
    //允许接收服务通知
    async requestSubscribeMessage() {
        const templateId = 'xnHyFO0tothgywck8xSYmmf1kwCMSLi4S7Yvcx6-mJc'//填入你自己想要的模板ID，记得复制粘贴全，我自己因为网页没开全，结果浪费半小时
        wx.requestSubscribeMessage({
        //tmplIds: [templateId,templateId2,templateId3],
        tmplIds: [templateId],
        success: (res) => {
            //if (res[templateId] === 'accept'&&res[templateId2] === 'accept'&&res[templateId3] === 'accept') {
            if (res[templateId] === 'accept') {
            this.setData({
                requestSubscribeMessageResult: '成功',
            })
            } else {
            this.setData({
                requestSubscribeMessageResult: `失败（${res[templateId]}）`,
            })
            }
        },
        fail: (err) => {
            this.setData({
            requestSubscribeMessageResult: `失败（${JSON.stringify(err)}）`,
            })
        },
        })
    },
    data: {
        creditA: 0,
        creditB: 0,

        userA: '',
        userB: '',

        days: 0,  // 初始化 days
        date:'2024-08-10',

        expressList: [], // 快递列表
        expressItem: '',
        pickupCode: ''
    },

    async onShow(){
        this.getCreditA()
        this.getCreditB()
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
        })
        this.getDays()
    },

    getCreditA(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidA}})
        .then(res => {
          this.setData({creditA: res.result.data[0].credit})
        })
    },
    
    getCreditB(){
        wx.cloud.callFunction({name: 'getElementByOpenId', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({creditB: res.result.data[0].credit})
        })
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