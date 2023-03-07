import type { ContactSelf, WechatyEventName } from 'wechaty'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { Server } from 'socket.io'

declare type ContactSelfInterface = ContactSelf

declare type HttpMethod = 'get' | 'post' | 'put' | 'delete'

declare type Socket = Server<DefaultEventsMap>

declare interface Config {
  port: number
  jwtSecret: string
  cronJob: string
  host: string
  tianApiKey: string
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

declare interface WorkerRepuestInfo {
  type: WechatyEventName | 'start'
  botname: string
  userName: string
  token: string
}

export { ContactSelfInterface, HttpMethod, Socket, Config, WorkerMessage, WorkerRepuestInfo }
