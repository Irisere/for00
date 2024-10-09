const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init();

exports.main = async (event, context) => {
  const { question } = event;

  try {
    const response = await axios.post('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      model: "glm-4-plus", // 替换为您调用的模型名称
      messages: [
        { role: "user", content: question }
        // 可以添加更多的消息上下文
      ]
    }, {
      headers: {
        'Authorization': `b90362698894e7b0df263d6c40311a45.n9GfndSndABclg5e`,
        'Content-Type': 'application/json',
      }
    });

    // 假设 API 返回的内容在 response.data.choices 中
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return {
        success: true,
        answer: response.data.choices[0].message.content // 获取 AI 的回答
      };
    } else {
      throw new Error('No valid response from AI API');
    }
  } catch (error) {
    console.error('Error calling AI API:', error.response ? error.response.data : error.message);
    return {
      success: false,
      message: error.message || '请求失败'
    };
  }
};
