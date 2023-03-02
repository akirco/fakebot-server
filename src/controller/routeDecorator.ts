import type { Context, Next } from 'koa'

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
      await originalMethod.call(this, ctx, next)
    }
  }
}

export { route }
