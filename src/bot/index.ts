import { WechatyBuilder, WechatyOptions, ScanStatus } from 'wechaty'
import cluster, { Worker } from 'cluster'
import logger from '../utils/logger'
import { connect } from '../utils/connect'
import { io, app } from './app'

import type { MessageInterface, ContactSelfInterface } from 'wechaty/impls'
import type { WorkerMessage, WorkerRepuestInfo } from '../types'
import type { Context, Next } from 'koa'
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

  public async start() {
    if (this.isPrimary) {
      logger.info(`🏷️\tMaster process:${process.pid} is running.`)
      // connect mongodb
      await connect()
      // Create server to receive requests & bind a middware
      app.use(this.handleRequest.bind(this))
      app.listen(config.port, () => {
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

  private async handleRequest(ctx: Context, next: Next) {
    // This is Master process
    // Create a new worker process for each request
    await next()

    const res = ctx.request.body as WorkerRepuestInfo
    if (res.type === 'start') {
      const worker = cluster.fork()
      const data: WorkerMessage = { type: res.type, data: res.botname, process: worker.process.pid }
      // Send a message to the worker to start processing the request
      worker.send(data)
      ctx.body = 'success'
      logger.info(`🏷️\tWorker PID:${worker.process.pid} is created.`)
    }
  }

  //* start worker
  private async startWorkerProcess() {
    // Handle the request and send a response back to the master process
    process.on('message', this.handleMasterMessage.bind(this))
  }

  private async handleMasterMessage(message: WorkerMessage) {
    console.log('handleMasterMessage', message)
    const options: WechatyOptions = {
      name: message.data,
      puppet: 'wechaty-puppet-wechat',
      puppetOptions: {
        uos: true,
      },
    }
    const wchatyBot = WechatyBuilder.build(options)

    await wchatyBot
      .on('scan', this.onScan)
      .on('login', this.onLogin)
      .on('message', this.onMessage)
      .start()
      .catch((e) => {
        logger.error(e)
      })
  }

  private handleWorkerMessage(_worker: Worker, message: WorkerMessage) {
    if (message) {
      console.log('handleWorkerMessage', message)
      io.on('connection', (socket) => {
        socket.on('scan', () => {
          console.log(123)
        })
      })
    }
  }

  private handleWorkerExit(worker: Worker, code: number, signal: string): void {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`)

    // Replace the dead worker
    const newWorker = cluster.fork()

    newWorker.on('message', this.handleWorkerMessage.bind(this))
  }

  //* worker events
  private async onScan(qrcode: string, status: ScanStatus) {
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
        type: 'scan',
        data: 'scan_qrcode_success',
        process: process.pid,
      } as WorkerMessage)
    }
  }

  private async onLogin(user: ContactSelfInterface) {
    const name = user.name()
    const avatar = await (await user.avatar()).toBase64()
    process.send!({
      type: 'login',
      data: { name, avatar },
      process: process.pid,
    } as WorkerMessage)
  }

  private async onMessage(message: MessageInterface) {
    process.send!({
      type: 'message',
      data: message.text().toString(),
      process: process.pid,
    } as WorkerMessage)
  }
}
