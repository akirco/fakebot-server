import { WechatyBuilder, WechatyOptions } from 'wechaty'

export class WechatyFactory {
  private instances: Map<string, unknown> = new Map()

  public createWechatyBot(name: string, token: string) {
    const options = {
      name,
      puppet: 'wechaty-puppet-wechat',
      puppetOptions: {
        uos: true,
        token,
      },
    } as WechatyOptions
    return WechatyBuilder.build(options)
  }

  public setWechatyInstanceId(name: string, id: string) {
    this.instances.set(name, id)
  }
  public getWechaty(id: string) {
    return this.instances.get(id)
  }

  public getAllWechatyIds(): string[] {
    return Array.from(this.instances.keys())
  }
}
