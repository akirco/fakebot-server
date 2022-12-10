import Koa from 'koa'
import errorHandler from './middleware/errorHandler'
import { config } from './config'
import { router } from './routes'

const app = new Koa()

app.use(router.routes())
app.use(router.allowedMethods())
errorHandler(app)

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
})
