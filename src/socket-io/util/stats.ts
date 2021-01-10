import { io } from '../../controllers/app'

function stats() {
  const rooms = io.sockets.adapter.rooms
  const clients = new Map<string, Set<string>>()

  Object.keys(rooms).forEach((room: string) => {
    const { sockets } = rooms[room]

    if (room.includes('/')) {
      const [server, channel] = room.split('/')

      if (!clients.has(server)) clients.set(server, new Set())
      const serverClients = clients.get(server)
      Object.keys(sockets).forEach(socket => serverClients.add(socket))
    }
  })

  const servers = [] as [string, number][]

  clients.forEach((sockets, server) => servers.push([server, sockets.size]))

  return {
    clients,
    servers: servers.sort(
      ([, aSize], [, bSize]) => (aSize === bSize ? 0 : bSize > aSize ? 1 : -1)
    )
  }
}

export default stats
;(global as any).stats = stats
