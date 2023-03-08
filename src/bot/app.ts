import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import http from 'http'
import { Server } from 'socket.io'
import serve from 'koa-static'
import { responseJson } from '../middleware/response'
import router from '../router'
import { config } from '../config'

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
app.use(serve(__dirname))

export { io, server }
