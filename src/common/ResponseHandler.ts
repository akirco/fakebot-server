import Const from './constants'
import Errors from './errors'
import { response } from './response'

const HTTP = Const.HTTP_CODE
const CUSTOM = Const.CUSTOM_CODE
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ResponseHandler(CODE: number, _MSG: string, _DATA?: any) {
  switch (CODE) {
    case HTTP.BAD_REQUEST:
      return response('', CODE, Errors[400])
    case HTTP.UNAUTHORIZED:
      return response('', CODE, Errors[401])
    case HTTP.FORBIDDEN:
      return response('', CODE, Errors[403])
    case HTTP.NOT_FOUND:
      return response('', CODE, Errors[404])
    case HTTP.INTERNAL_SERVER_ERROR:
      return response('', CODE, Errors[500])
    case HTTP.SERVICE_BUSY:
      return response('', CODE, Errors[503])
    case CUSTOM.SOME_CUSTOM_ERROR:
      return response('', CODE, Errors[1001])
    default:
      return response(_DATA, CODE, Errors[0])
  }
}

export default ResponseHandler
