import { Server } from 'socket.io'

interface SocketIOInstance {
  emit(eventName: string, data: unknown): void
  on(eventName: string, callback: (...args: any[]) => void): void
}

function createSocketIOServer(server: any): SocketIOInstance {
  const io = new Server(server)

  function emit(eventName: string, data: unknown): void {
    io.emit(eventName, data)
  }

  function on(eventName: string, callback: (...args: any[]) => void): void {
    io.on(eventName, callback)
  }

  return {
    emit,
    on,
  }
}

export default createSocketIOServer
