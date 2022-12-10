import mongoose from 'mongoose'
import { config } from '../config'

const dbConnect = () => {
  mongoose.connect(config.mongoUrl)
  const db = mongoose.connection
  mongoose.Promise = global.Promise
  db.on('error', function (err) {
    console.log('数据库连接出错', err)
  })
  db.on('open', function () {
    console.log('数据库连接成功')
  })
  db.on('disconnected', function () {
    console.log('数据库连接断开')
  })
}

export { dbConnect, mongoose }
