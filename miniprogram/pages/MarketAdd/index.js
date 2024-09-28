Page({
  //保存正在编辑的商品
  data: {
    title: '',
    desc: '',
    
    credit: 0,
    maxCredit: getApp().globalData.maxCredit,
    presetIndex: 0,
    presets: [{
        name:"俺要自己输",
        title:"",
        desc:"",
    },{
        name:"马杀鸡",
        title:"按摩券",
        desc:"凭此券可以要求对方为自己按摩。",
    },{
        name:"点歌",
        title:"点歌券",
        desc:"凭此券可以要求对方唱一首歌。",
    },{
        name:"奶茶券",
        title:"奶茶权限",
        desc:"凭此券可以向对方索要一杯奶茶。",
    },{
        name:"心愿必达券",
        title:"心愿必达券",
        desc:"凭此券可以要求对方实现一个心愿。",
    },{
        name:"damn冒险券",
        title:"大冒险券",
        desc:"凭此券可以让对方做一次大冒险。",
    },{
        name:"跳舞券",
        title:"跳舞券",
        desc:"凭此券可以让对方录一段舞。",
    },{
        name:"掏掏心窝",
        title:"真心话券",
        desc:"凭此券可以要求对方回答一个真心话。",
    },{
        name:"灭火器",
        title:"不生气券",
        desc:"凭此券可以要求对方生气的时候不许发火好好沟通。",
    },{
        name:"给饭吃",
        title:"饭票",
        desc:"凭此券可以让对方做一次或请一次饭，具体视情况而定。",
    },{
        name:"买小礼物",
        title:"小礼物盒",
        desc:"凭此券可以让对方买点小礼物，像泡泡马特什么的。",
    }],
    list: getApp().globalData.collectionMarketList,
  },

  //数据输入填写表单
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  onCreditInput(e) {
    this.setData({
      credit: e.detail.value
    })
  },
  onPresetChange(e){
    this.setData({
      presetIndex: e.detail.value,
      title: this.data.presets[e.detail.value].title,
      desc: this.data.presets[e.detail.value].desc,
    })
  },

  //保存商品
  async saveItem() {
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
    if (this.data.credit <= 0) {
      wx.showToast({
        title: '一定要有积分',
        icon: 'error',
        duration: 2000
      })
      return
    }else{
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
    }
  },

  // 重置所有表单项
  resetItem() {
    this.setData({
      title: '',
      desc: '',
      credit: 0,
      presetIndex: 0,
      list: getApp().globalData.collectionMarketList,
    })
  }
})