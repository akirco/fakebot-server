import Router from '@koa/router'
const router = new Router()
import { Controller } from '../controller'

const server = new Controller()

router.get('/', server.Home)

export default router
