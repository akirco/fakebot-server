import type { Context, Next } from 'koa'
export default function () {
  return async function (_ctx: Context, next: Next) {
    // if (!global.bot) throw { message: '机器人已掉线，请重新登录' }
    await next()
  }
}
