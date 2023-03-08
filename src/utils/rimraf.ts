import { rimraf } from 'rimraf'

async function rmrf(filename: string) {
  return await rimraf(filename)
}

export default rmrf
