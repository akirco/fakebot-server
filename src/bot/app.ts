import http from 'http'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { Server } from 'socket.io'

import { config } from '../config'
import { responseJson } from '../middleware/response'
import router from '../router'

const app = new Koa()
const server = http.createServer(app.callback())
const io = new Server(server, {
  cors: { origin: config.socket },
  pingTimeout: 10000,
  pingInterval: 5000,
})

app.use(responseJson)
app.use(router.routes())
app.use(router.allowedMethods())
app.use(bodyParser())

export { io, server }
