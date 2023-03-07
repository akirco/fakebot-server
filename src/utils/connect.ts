import mongoose from 'mongoose'
import { config } from '../config'

export async function connect() {
  const options: mongoose.ConnectOptions = {
    autoIndex: true,
    dbName: config.mongodb.source,
    maxPoolSize: config.mongodb.maxpool,
    user: config.mongodb.user,
    pass: config.mongodb.pass,
  }
  const instance = await mongoose.connect(config.mongodb.url, options)
  instance.connection.on('error', () => {
    console.log('error')
  })
  instance.connection.once('open', () => {
    console.log('connected!')
  })
}

export async function disconnect(): Promise<void> {
  await mongoose.disconnect()
}
