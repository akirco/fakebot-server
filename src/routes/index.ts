import Router from '@koa/router'
import Bot from '../controller/bot.controller'

export const router = new Router({ prefix: '/api' })

/**
 * bot router
 */
router.post('/bot/create',Bot.create)

router.post('/bot/login', Bot.login)

/**
 * system router
 */
