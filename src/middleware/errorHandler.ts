import type { Context, Next } from 'koa'
import type Koa from 'koa'
import ResponseHandler from '../common/ResponseHandler'

export default (app: Koa) => {
  app.use(async (ctx: Context, next: Next) => {
    let code = ctx.status
    let data = ctx.body
    console.log('ss', code, data)

    try {
      await next()
      code = ctx.status
      data = ctx.body
    } catch (err) {
      code = 500
    }
    ctx.body = ResponseHandler(code, '', data)
    console.log(ctx.body)
  })
}
