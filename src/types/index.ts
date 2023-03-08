import type { ContactSelf, WechatyEventName } from 'wechaty'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { Server } from 'socket.io'

declare type ContactSelfInterface = ContactSelf

declare type HttpMethod = 'get' | 'post' | 'put' | 'delete'

declare type Socket = Server<DefaultEventsMap>

declare interface Config {
  socket: string
  port: number
  jwtSecret: string
  cronJob: string
  host: string
  tianApiKey: string
  openaikey: string
  mongodb: {
    url: string
    source: string
    maxpool: number
    user: string
    pass: string
  }
}
declare interface WorkerMessage {
  type: WechatyEventName | 'start'
  data: any
  process?: number
}

declare interface WorkerRepuestMessage {
  type: WechatyEventName | 'start'
  botname: string
  username: string
  token: string
}

export type { ContactSelfInterface, HttpMethod, Socket, Config, WorkerMessage, WorkerRepuestMessage }
