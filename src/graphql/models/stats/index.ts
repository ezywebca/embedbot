import { store } from 'database'
import Guest from 'database/models/Guest'
import { cache, client } from 'engine'

import { io } from '../../../controllers/app'

const Stats = {
  totalServers: () => client.guilds.size,
  totalMembers() {
    let total = 0
    client.guilds.forEach(guild => (total += guild.memberCount))
    return total
  },

  async totalGuests() {
    const guests = await store.guests.find({})
    return guests.length
  },
  async totalMessages() {
    let total = 0
    const guests = await store.guests.find<Guest>({})

    guests.forEach(guest => (total += guest.log.messages.length))
    return total
  },
  onlineGuests: () => (<any>io.engine).clientsCount,

  cache: {
    totalServers: () => cache.store.size,
    totalChannels() {
      let total = 0
      cache.store.forEach(server => (total += server.size))
      return total
    },
    totalMessages() {
      let total = 0
      cache.store.forEach(server =>
        server.map(channel => (total += channel.size))
      )
      return total
    }
  }
}

export default Stats
