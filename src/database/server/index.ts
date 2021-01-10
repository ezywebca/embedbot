import config from 'config'
import { store } from 'database'
import Server from 'database/models/Server'

/**
 * Fetches the storage for a server
 * @param id The server id to fetch
 */
export async function Fetch(id: string): Promise<Server> {
  const server = await store.servers.findOne<Server>({ id })

  return {
    id,
    theme: {
      ...config.embed.theme,
      ...(server && server.theme)
    }
  }
}

/**
 * Updates the storage for a server
 * @param id The server id to fetch
 */
export async function Update(id: string, storage: Server) {
  const server = await store.servers.findOne<Server>({ id })

  if (server) {
    store.servers.update(
      { id },
      {
        id,
        ...server,
        ...storage
      }
    )
  } else {
    store.servers.insert({
      id,
      ...storage
    })
  }
}

// Debugging
;(global as any).server = { Fetch, Update }
