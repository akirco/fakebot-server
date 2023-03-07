import Router from 'koa-router'
const router = new Router()
import { Controller } from '../controller'

const server = new Controller()

/**
 * User router
 */
router.get('/', server.Home)

router.get('/signup', server.Signup)

/**
 * Bot router
 */

// router.post('/createBot', server.CreateBot)

export default router


router.use()