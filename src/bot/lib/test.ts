import { WechatyFactory } from '..'

const wechaty = new WechatyFactory()
const bot = wechaty.createWechatyBot('go', 'uuid4')
wechaty.setWechatyInstanceId('go', bot.id)

bot.on('scan', (qrcode, status) => {
  const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
  console.log(url, status)
})
bot.on('login', (user) => {
  console.log(user)
})

bot.start()
