const WebSocket = require('ws')

const Event = {
  ENTER: 'enter',
  LEAVE: 'leave'
}

let instance = null

class WsServer {
  constructor() {
    this.eventsAndListeners = {}
    this.server = null
  }

  static getInstance() {
    if (instance) {
      return instance
    }

    instance = new WsServer()

    return instance
  }

  async onEvent(event, ws, req) {
    const enterListeners = this.eventsAndListeners[event]

    if (!enterListeners) {
      return
    }

    for (const handler of enterListeners) {
      await handler.wsEvent(event, null, ws, req)
    }
  }

  async onEnter(ws, req) {
    await this.onEvent(Event.ENTER, ws, req)
  }

  async onLeave(ws, req) {
    await this.onEvent(Event.LEAVE, ws, req)
  }

  onEvents(ws, req) {
    ws.on('message', async data => {
      try {
        const json = JSON.parse(data)

        const event = json.event
        const message = json.message
        const eventListeners = this.eventsAndListeners[event]
        if (!eventListeners) {
          return
        }
        for (const handler of eventListeners) {
          await handler.wsEvent(event, message, ws, req)
        }
      } catch (e) {}
    })
  }

  addEventListener(event, handler) {
    let handlers = this.eventsAndListeners[event]
    if (!(handlers instanceof Array)) {
      handlers = []
    }
    if (handlers.indexOf(handler) === -1) {
      handlers.push(handler)
    }
    this.eventsAndListeners[event] = handlers
  }

  broadcast(data, filter) {
    const wss = this.server
    wss.clients.forEach(async client => {
      if (filter && !filter(client)) {
        return
      }
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  size() {
    return this.server.clients.size
  }

  attach(server) {
    const wss = new WebSocket.Server({ server })
    this.server = wss

    wss.on('connection', async (ws, req) => {
      await this.onEnter(ws, req)
      this.onEvents(ws, req)

      ws.on('close', async () => {
        await this.onLeave(ws, req)
      })
    })
  }
}

module.exports = () => {
  return WsServer.getInstance()
}
