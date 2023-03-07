import { CDOE, MSG } from '../../constants'
import type { Context, Next } from 'koa'

const HTTP = CDOE.HTTP_CODE
const CUSTOM = CDOE.CUSTOM_CODE

function response<T>(_CODE: number, _MSG: string, _DATA?: T) {
  switch (_CODE) {
    case HTTP.BAD_REQUEST:
      _MSG = MSG[400]
      break
    case HTTP.UNAUTHORIZED:
      _MSG = MSG[401]
      break
    case HTTP.FORBIDDEN:
      _MSG = MSG[403]
      break
    case HTTP.NOT_FOUND:
      _MSG = MSG[404]
      break
    case HTTP.INTERNAL_SERVER_ERROR:
      _MSG = MSG[500]
      break
    case HTTP.SERVICE_BUSY:
      _MSG = MSG[503]
      break
    case CUSTOM.SOME_CUSTOM_ERROR:
      _MSG = MSG[1001]
      break
    default:
      _MSG
  }
  return { _CODE, _MSG, _DATA }
}

export const responseJson = async (ctx: Context, next: Next) => {
  try {
    await next()
    const resp = ctx.response
    ctx.body = response(resp.status, resp.message, resp.body)
    ctx.type = 'application/json'
  } catch (error) {
    ctx.body = {
      _CODE: error.statusCode || 500,
      _MSG: error.message,
      _DATA: '',
    }
  }
}
