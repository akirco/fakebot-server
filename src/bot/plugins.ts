import type { WechatyPlugin } from 'wechaty'
import type { WechatyInterface } from 'wechaty/impls'
import OpenAI from './openai'
import { MessageType } from '../constants'

import { WEIXINOFFICIAL } from '../constants'

export function chatgptReplyPlugin(): WechatyPlugin {
  const openai = new OpenAI()
  return function (bot: WechatyInterface) {
    bot.on('message', async (message) => {
      const talkerName = message.talker().name()
      if (message.self() || WEIXINOFFICIAL.includes(talkerName)) {
        return
      } else {
        if (message.type() === MessageType.Text) {
          try {
            const response = await openai.reply(message.text())
            if (response) {
              message.say(response)
            } else {
              message.say('累了，累了，不哔哔了。。。')
            }
          } catch (error) {
            message.say('ChatGPT 出故障了')
          }
        }
      }
    })
  }
}
