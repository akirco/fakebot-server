import type { Context, Next } from 'koa'
import Bot from '../bot'
export default {
  async login(ctx: Context, next: Next) {
    const _id = ctx.request.query['botId']
    const bot = new Bot(_id as string)
    const result = await bot.init()
    ctx.body = result
    next()
  },
  async create(ctx: Context, next: Next) {
    ctx.body = ''
    next()
  },
}
