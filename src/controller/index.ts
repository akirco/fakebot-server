import type { Context } from 'koa'
import { route } from './routeDecorator'
import { api, http } from './enum'

export class Controller {
  @route(api.home, http.get)
  async Home(ctx: Context): Promise<void> {
    ctx.body = 'hello world!'
  }
}
