// eslint-disable-next-line @typescript-eslint/no-explicit-any
const response = (data?: any, code = 0, msg = 'success') => {
  return {
    code,
    msg,
    data,
  }
}

export { response }
