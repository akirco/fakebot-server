import { OfficialPuppetNpmName, WechatyBuilder, WechatyOptions } from 'wechaty'
import Robot from '../models/bot'
import onLogin from './lib/onlogin'

class Bot {
  constructor(public id: string) {
    this.id = id
  }
  async init() {
    const bot = await Robot.findOne({ id: this.id }, { token: 1, nickName: 1, id: 1 })
    if (!bot) throw { message: '机器人不存在' }
    const config: WechatyOptions = {
      name: bot.nickName,
      puppetOptions: {
        uos: true,
      },
      puppet: bot.puppet as OfficialPuppetNpmName,
    }
    const chatBot = WechatyBuilder.build(config)
    chatBot.use()
    const result = await new Promise((resolve) => {
      chatBot
        .on('scan', (qrcode) => {
          resolve(qrcode)
        })
        .on('login', async (user) => {
          const res = await onLogin(chatBot, this.id, user)
          resolve(res)
        })
    })
    return result
  }
}

export default Bot
