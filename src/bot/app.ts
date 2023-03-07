import { config } from '../config'
import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import type { Middleware } from 'koa'
import http from 'http'
import serve from 'koa-static'
import { responseJson } from '../middleware/response'
import router from '../router'
import logger from '../utils/logger'
import createSocketIOServer from './io'
import type { Socket } from 'socket.io'

async function createServer(workerHandler: Middleware) {
  const app = new Koa()

  const server = http.createServer(app.callback())
  const io = createSocketIOServer(server)

  app.use(responseJson)
  app.use(workerHandler)
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.use(bodyParser())
  app.use(serve(__dirname))
  io.on('connection', (socket: Socket) => {
    console.log(`Client ${socket.id} connected`)

    socket.on('message', (data: unknown) => {
      console.log(`Received message from client ${socket.id}: ${data}`)
      io.emit('message', `Server received message: ${data}`)
    })

    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} disconnected`)
    })
  })

  app.listen(config.port, () => {
    logger.info(`🫵\tServer running on http://localhost:${config.port}`)
  })
}

export default createServer
