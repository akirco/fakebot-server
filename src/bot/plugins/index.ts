import { ScanStatus, WechatyPlugin, WechatyOptions, Wechaty } from 'wechaty'
type WechatFactoryPluginOptions = WechatyOptions & {
  uid: string
  botId?: string
}

export function WechatFactoryPlugin(config?: WechatFactoryPluginOptions): WechatyPlugin {
  return function (bot: Wechaty) {
    bot.on('scan', (qrcode, status, data) => {
      if (status === ScanStatus.Waiting) {
        console.log(qrcode, data, config)
      }
    })
  }
}
