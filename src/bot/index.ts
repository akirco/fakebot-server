import type { MessageInterface, ContactSelfInterface } from 'wechaty/impls'
import type { WorkerMessage, WorkerRepuestMessage } from '../types'
import type { Socket } from 'socket.io'

import { WechatyBuilder, WechatyOptions, ScanStatus } from 'wechaty'
import cluster, { Worker } from 'cluster'

import logger from '../utils/logger'
import { connect } from '../utils/connect'
import { io, server } from './app'
import { config } from '../config'

export default class WechatyBot {
  masterProcess: typeof process
  constructor() {
    this.masterProcess = process
  }

  private get isPrimary() {
    return cluster.isPrimary
  }

  private get isWorker() {
    return cluster.isWorker
  }

  /**
   * * app entry
   */
  public async start() {
    if (this.isPrimary) {
      logger.info(`🏷️\tMaster process:${process.pid} is running.`)
      // connect mongodb
      await connect()
      // Create server to receive requests & bind a middware
      // ? handleRequest中间件的方式已移除
      // app.use(this.handleRequest.bind(this))
      io.on('connection', this.handleSocket.bind(this))

      server.listen(config.port, () => {
        logger.info(`🫵\tServer running on http://localhost:${config.port}`)
      })

      cluster.on('message', this.handleWorkerMessage.bind(this))

      cluster.on('exit', this.handleWorkerExit.bind(this))
    } else if (this.isWorker) {
      await this.startWorkerProcess()
      logger.info('🏷️\tWorker is going to start...')
    }
  }

  public stop() {
    logger.info(`🏷️\tWorker process is stoped`)

    // Send a message to each worker to stop gracefully
    Object.values(cluster.workers!).forEach((worker) => {
      worker!.send({ type: 'stop' })
    })

    // Forcefully kill workers after a timeout
    setTimeout(() => {
      console.log('Forcefully killing workers...')
      Object.values(cluster.workers!).forEach((worker) => {
        worker!.kill()
      })
    }, 5000)

    // Exit master process
    this.masterProcess.exit()
  }

  /**
   * @field type: WechatyEventName | 'start'
   * @field botname: string
   * @field username: string
   * @field token: string

   * @param socket socket
   */
  private handleSocket(socket: Socket) {
    socket.once('hello', (message: WorkerRepuestMessage) => {
      // ? 这里可以加入数据库验证，socket.io中间件
      if (message.type === 'start' && message.token === '96+8764651253') {
        const worker = cluster.fork()
        const data: WorkerMessage = { type: message.type, data: message.botname, process: worker.process.pid }
        //* Send a message to the worker to start processing the request
        worker.send(data)
        worker.on('message', (message: WorkerMessage) => {
          logger.debug('debug:', message)
          if (message.type === 'scan') {
            socket.emit('scan', message)
          }
          if (message.type === 'dong') {
            socket.emit('dong', message)
          }
          if (message.type === 'login') {
            socket.emit('login', message)
          }
          if (message.type === 'message') {
            socket.emit('message', message)
          }
        })
      }
    })
  }

  /**
   * 开启worker进程的事件，并监听消息
   */
  private async startWorkerProcess() {
    //* Handle the request and send a response back to the master process
    process.on('message', this.handleMasterMessage.bind(this))
  }

  private handleMasterMessage(message: WorkerMessage) {
    // ! handleWorkerMessage事件会转发其他类型消息到这，引发错误，
    if (message.type === 'start') {
      logger.info('handleMasterMessage\n', message)
      const options: WechatyOptions = {
        name: message.data,
        puppet: 'wechaty-puppet-wechat',
        puppetOptions: {
          uos: true,
        },
      }
      const wchatyBot = WechatyBuilder.build(options)
      wchatyBot
        .on('scan', this.onScan)
        .on('login', this.onLogin)
        .on('message', this.onMessage)
        .start()
        .catch((err) => {
          logger.info('wchatyBot Error:\n', err)
        })
    } else {
      return
    }
  }

  /**
   * Transfer worker message
   * @param worker worker instance
   * @param message message
   */
  private handleWorkerMessage(worker: Worker, message: WorkerMessage) {
    if (message) {
      console.log('handleWorkerMessage\n', message)
      worker.send(message)
    }
  }

  /**
   * handleWorkerExit
   * @param worker worker
   * @param code exit code
   * @param signal unknown
   */
  private handleWorkerExit(worker: Worker, code: number, signal: string): void {
    logger.warn(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`)

    //* Replace the dead worker
    const newWorker = cluster.fork()

    newWorker.on('message', this.handleWorkerMessage.bind(this))
  }

  /**
   * Transfer wechaty onscan envent
   * @param qrcode qrcode
   * @param status qrcode status
   */
  private onScan(qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
      process.send!({
        type: 'scan',
        data: url,
        process: process.pid,
      } as WorkerMessage)
    }
    if (status === ScanStatus.Confirmed) {
      process.send!({
        type: 'dong',
        data: 'scan_qrcode_success',
        process: process.pid,
      } as WorkerMessage)
    }
  }

  /**
   * Transfer wechaty login event
   * @param user logined user
   */
  private onLogin(user: ContactSelfInterface) {
    const name = user.name()
    process.send!({
      type: 'login',
      data: name,
      process: process.pid,
    } as WorkerMessage)
  }

  /**
   * Transfer wechaty onmessage event
   * @param message message
   */
  private onMessage(message: MessageInterface) {
    process.send!({
      type: 'message',
      data: message.text().toString(),
      process: process.pid,
    } as WorkerMessage)
  }
}
