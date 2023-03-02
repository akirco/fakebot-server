export const CDOE = Object.freeze({
  HTTP_CODE: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_BUSY: 503,
  },
  CUSTOM_CODE: {
    SOME_CUSTOM_ERROR: 1001,
  },
})

export const MSG = Object.freeze({
  0: 'success',
  400: 'invalid param',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not found',
  500: 'internal server error',
  503: 'service busy',
  1001: 'some custom error msg',
})
