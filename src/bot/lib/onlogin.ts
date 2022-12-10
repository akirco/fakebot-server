/* eslint-disable @typescript-eslint/no-explicit-any */
import Robot from '../../models/bot'
const onLogin = async (bot: any, botId: string, user: any) => {
  const chatBot = await Robot.findOne({ _id: botId }, { startSay: 1, nickName: 1 })
  if (chatBot) {
    console.log(`机器人${(chatBot.nickName, bot, user)} 登陆啦!!!`)
    // await Robot.updateOne(
    //   { _id: botId },
    //   {
    //     status: 1,
    //     lastLoginT: new Date(),
    //     name: user.payload.name,
    //     id: user.id,
    //     weixin: user.payload.weixin,
    //     avatar: user.payload.avatar,
    //   }
    // )
    // bot.id = user.id
  }
}

export default onLogin
