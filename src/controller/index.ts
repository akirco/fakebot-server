import type { Context } from 'koa'
// import Service from '../service'

const Controller = {
  async Home(ctx: Context) {
    ctx.body = 'hello world!'
  },
  async Signup(ctx: Context) {
    const data = ctx.request.body
    // const result = await Service.signup(data)
    ctx.body = data
  },
}

export default Controller
