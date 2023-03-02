class Bot {
  qrcode: string
  user: Bot.ContactSelfInterface
  constructor() {
    this.qrcode = ''
    this.user = {} as Bot.ContactSelfInterface
  }
  setQRCode(qrcode: string) {
    this.qrcode = qrcode
    // io.emit('qrcode', this.qrcode)
  }
  getQRCode() {
    console.log(this.qrcode)

    return this.qrcode
  }

  isLogin(user: Bot.ContactSelfInterface) {
    this.user = user
    // io.emit('login', this.user)
  }
}

export default Bot
