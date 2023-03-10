import { Configuration, OpenAIApi } from 'openai'
import { config } from '../config'

export default class OpenAI {
  config: Configuration
  openai: OpenAIApi
  constructor() {
    this.config = new Configuration({
      apiKey: config.openaikey,
    })
    this.openai = new OpenAIApi(this.config)
  }
  setApiKey(apikey: string | undefined) {
    return apikey
  }
  async reply(message: string) {
    const chat = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0301',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.6,
    })
    return chat.data.choices[0]?.message?.content
  }
}
