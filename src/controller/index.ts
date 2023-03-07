import type { Context } from 'koa'
import Service from '../service'

export class Controller {
  async Home(ctx: Context): Promise<void> {
    ctx.body = 'hello world!'
  }
  async Signup(ctx: Context): Promise<void> {
    const data = ctx.request.body
    const result = await Service.signup(data)
    ctx.body = result
  }
}
