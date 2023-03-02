import type { ContactSelf } from 'wechaty'
import type { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { Server } from 'socket.io'

declare global {
  namespace Bot {
    type ContactSelfInterface = ContactSelf
  }
  namespace APP {
    interface Config {
      port: number
      jwtSecret: string
      cronJob: string
      host: string
      mongodbUrl: string
      tianApiKey: string
    }
  }
  namespace Route {
    type HttpMethod = 'get' | 'post' | 'put' | 'delete'
  }
  namespace IO {
    type Socket = Server<DefaultEventsMap>
  }
}
