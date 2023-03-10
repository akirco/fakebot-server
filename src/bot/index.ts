import cluster, { Worker } from 'cluster'
import type { Socket } from 'socket.io'
import { ScanStatus, WechatyBuilder, WechatyOptions } from 'wechaty'
import type { ContactSelfInterface, MessageInterface } from 'wechaty/impls'

import { config } from '../config'
import type { WorkerMessage, WorkerRepuestMessage } from '../types'
import { connect } from '../utils/connect'
import logger from '../utils/logger'
import { io, server } from './app'
import { generateQrCode } from '../utils/qrcode'
import { chatgptReplyPlugin } from './plugins'

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

  public async start() {
    if (this.isPrimary) {
      logger.info(`🏷️\tMaster process:${process.pid} is running.`)
      // ! connect mongodb
      await connect()
      // ! Create server to receive requests & bind a middware
      // ! handleRequest中间件的方式已移除
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
    logger.info('🏷️\tWorker process is stoped')
    // !Send a message to each worker to stop gracefully
    Object.values(cluster.workers!).forEach((worker) => {
      const message = {
        type: 'stop',
        data: null,
        process: worker?.process.pid,
      } as WorkerMessage
      worker!.send(message)
    })
    // !Forcefully kill workers after a timeout
    setTimeout(() => {
      console.log('Forcefully killing workers...')
      Object.values(cluster.workers!).forEach((worker) => {
        worker!.kill()
      })
    }, 5000)

    // !Exit master process
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
        const data: WorkerMessage = {
          type: message.type,
          data: message.botname,
          process: worker.process.pid,
        }
        //* Send a message to the worker to start processing the request
        worker.send(data)
        worker.on('message', async (message: WorkerMessage) => {
          if (message.type === 'scan') {
            const qrcode = await generateQrCode(message.data)
            socket.emit('scan', Object.assign({ qrimg: qrcode }, message))
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

  private async handleMasterMessage(message: WorkerMessage) {
    // ! handleWorkerMessage事件会转发其他类型消息到这，引发错误，
    if (message.type === 'start') {
      logger.info('🏷️\tWechaty Worker process is start...')
      const options: WechatyOptions = {
        name: message.data,
        puppet: 'wechaty-puppet-wechat',
        puppetOptions: {
          uos: true,
        },
      }
      const wchatyBot = WechatyBuilder.build(options)
      wchatyBot.use(chatgptReplyPlugin())
      await wchatyBot.start().catch((err) => {
        logger.error('🏷️\tWchatyBot Error:\n', err)
      })
      wchatyBot
        .on('scan', this.onScan)
        .on('login', this.onLogin)
        .on('message', this.onMessage)
        .on('logout', this.onLogout)
        .on('error', this.onError)
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
      console.log('🏷️\tHandleWorkerMessage\n', message)
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
    logger.warn(
      `🏷️\tWorker ${worker.process.pid} died with code ${code} and signal ${signal}`
    )

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
    logger.info('🏷️\tWechaty scan event...')

    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
      const url = `https://wechaty.js.org/qrcode/${encodeURIComponent(qrcode)}`
      process.send!({
        type: 'scan',
        data: url,
        process: process.pid,
      } as WorkerMessage)
    }
  }

  /**
   * Transfer wechaty login event
   * @param user logined user
   */
  private onLogin(user: ContactSelfInterface) {
    logger.info('🏷️\tWechaty login event...')
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
    logger.info('🏷️\tWechaty message event...')
    process.send!({
      type: 'message',
      data: message.text().toString(),
      process: process.pid,
    } as WorkerMessage)
  }
  private onLogout(user: ContactSelfInterface, reason?: string | undefined) {
    logger.info('🏷️\tWechaty logout event...')
    process.send!({
      type: 'message',
      data: { user, reason },
      process: process.pid,
    } as WorkerMessage)
  }
  private onError(error: unknown) {
    if (error) {
      logger.info('🏷️\tWechaty error event...')
      process.send!({
        type: 'message',
        data: error.toString(),
        process: process.pid,
      } as WorkerMessage)
    }
  }
}
