import { ChatGPTAPI } from 'chatgpt'

import { config } from '../config'

const chat = async () => {
  const api = new ChatGPTAPI({
    apiKey: config.openaikey,
    completionParams: {
      temperature: 0.5,
      top_p: 0.8,
    },
  })

  // send a message and wait for the response
  let res = await api.sendMessage('What is OpenAI?')
  console.log(res.text)

  // send a follow-up
  res = await api.sendMessage('Can you expand on that?', {
    parentMessageId: res.id,
  })
  console.log(res.text)

  // send another follow-up
  res = await api.sendMessage('What were we talking about?', {
    parentMessageId: res.id,
  })
  console.log(res.text)
}

export default chat
