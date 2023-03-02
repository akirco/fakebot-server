import mongoose from 'mongoose'
import { config } from '../config'

export const dbState = () => {
  mongoose.connect(config.mongodbUrl)
  const db = mongoose.connection

  db.on('connecte', () => {
    console.log('connected to mongoDB')
  })

  db.on('error', (error) => {
    console.log('mongoDB error:', error)
  })

  db.on('disconnected', () => {
    console.log('disconnected to mongoDB')
  })
}

export const mg = mongoose
