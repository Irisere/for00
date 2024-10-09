Page({
  data: {
    input: "",
    messages: [], // 初始化为空数组
    loading: false,
    loadingMessage: "", // 新增字段用以存储加载消息
  },

  // 页面加载时
  onLoad() {
    // 添加默认的AI消息
    this.setData({
      messages: [{ type: 'ai', content: '👩🏼‍💻' }]
    });
  },
  
  // 当用户输入问题时
  onInput(event) {
    this.setData({
      input: event.detail.value
    });
  },
  
  // 发送问题到AI
  async onAsk() {
    const { input, messages } = this.data;
    console.log('messages:', messages);
    
    if (!input) {
      wx.showToast({
        title: '请输入问题',
        icon: 'none'
      });
      return;
    }
    
    // 添加用户消息到对话框
    this.setData({
      messages: [...messages, { type: 'user', content: input }],
      input: "",
      loading: true,
      loadingMessage: "回答生成中..." // 设置加载中提示
    });

    try {
      console.log('Sending question to AI:', input);
      const result = await wx.cloud.callFunction({
        name: 'askAI',
        data: { question: input }
      });

      if (result.result.success) {
        this.setData({ 
          messages: [...this.data.messages, { type: 'ai', content: result.result.answer }],
          input: "",
          loading: false,
          loadingMessage: "" // 清空加载中提示
        });
      } else {
        wx.showToast({
          title: 'AI返回错误',
          icon: 'none'
        });
        this.setData({ loading: false, loadingMessage: "" });
      }
    } catch (error) {
      console.error('Error calling cloud function:', error);
      this.setData({ loading: false, loadingMessage: "" });
      wx.showToast({
        title: '请求失败，请稍后再试。',
        icon: 'none'
      });
    }
  }
});
