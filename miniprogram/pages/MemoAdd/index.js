Page({
    //增加消息接收与发送功能
    async handleTap() {
        await this.saveMemo();
        await this.sendSubscribeMessage();
  },
  //发送消息
  sendSubscribeMessage(e) {
      //调用云函数，
      wx.cloud.callFunction({
      name: 'information',
      //data是用来传给云函数event的数据，你可以把你当前页面获取消息填写到服务通知里面
      data: {
          action: 'sendSubscribeMessage',
          templateId: 'e7R2g3YflelgU4llEjEg3AiY4tceHXwlI93LblyCkls',//这里我就直接把模板ID传给云函数了
          me:'Test_me',
          name:'Test_activity',
          _openid:'oa_GZ7eK1OkY5SHLJZk53UYGSM7k'//填入自己的openid
      },
      success: res => {
          console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
          
          this.setData({
          subscribeMessageResult: JSON.stringify(res.result)
          })
      },
      fail: err => {
          wx.showToast({
          icon: 'none',
          title: '调用失败',
          })
          console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
      }
      })
  },  
  //保存正在编辑的任务
  data: {
    title: '',
    desc: '',
    credit: 0,
    list: getApp().globalData.collectionMemoList,
  },

  //数据输入填写表单
  onTitleInput(e) {
    console.log('输入的标题:', e.detail.value); // 确认输入
    this.setData({
      title: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },

  //保存任务
  async saveMemo() {
    // 对输入框内容进行校验
    if (this.data.title === '') {
      wx.showToast({
        title: '标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.title.length > 12) {
      wx.showToast({
        title: '标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: '描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    await wx.cloud.callFunction({name: 'addElement', data: this.data}).then(
            () => {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        )
        setTimeout(function () {
            wx.navigateBack()
        }, 1000)
  },

  // 重置所有表单项
  resetMemo() {
    this.setData({
      title: '',
      desc: '',
      credit: 0,
      list: getApp().globalData.collectionMemoList,
    })
  }
})