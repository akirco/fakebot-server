import { config } from './config'
import bodyParser from 'koa-bodyparser'
import Koa from 'koa'
import http from 'http'
import { Server } from 'socket.io'
import serve from 'koa-static'
import { respHandler } from './middleware/response'
import router from './router'

const app = new Koa()
app.use(router.routes())
app.use(router.allowedMethods())
const server = http.createServer(app.callback())
const io = new Server(server)

io.on('con', () => {
  console.log(1)
})

app.use(respHandler)
app.use(bodyParser())
app.use(serve(__dirname))

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
})
