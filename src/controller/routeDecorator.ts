import type { Context, Next } from 'koa'
import Router from 'koa-router'
const router = new Router()

function route(path: string, method: Route.HttpMethod) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    descriptor.value = async function (ctx: Context, next: Next) {
      if (ctx.method.toLowerCase() !== method) {
        return next()
      }
      if (ctx.path !== path) {
        return next()
      }

      console.log(originalMethod.toString())

      router['get'](method, path, async () => {
        await originalMethod.call(this, ctx, next)
      })
      console.log(ctx.method, ctx.path)
    }
  }
}

export { route }

// function Home(ctx: Context) {
//   return __awaiter(this, void 0, void 0, function* () {
//     ctx.body = 'hello world!'
//   })
// }
