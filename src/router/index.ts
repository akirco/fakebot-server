import Router from 'koa-router'
const router = new Router()
import controller from '../controller'

router.get('/', controller.Home)

router.get('/signup', controller.Signup)

export default router
