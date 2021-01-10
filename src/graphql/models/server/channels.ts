import config from 'config'
import { TextChannel } from 'discord.js'
import { client } from 'engine'
import Permissions from 'engine/permissions'
import memoize from 'memoizee'
import timestring from 'timestring'

import { Channel } from './../../../types/message'

async function Channels(server: string) {
  const guild = client.guilds.get(server)

  const channels = await Promise.all(
    guild.channels
      // Only allow text channels
      .filter(channel => channel.type === 'text')

      // Order channels by position
      .sort((a, b) => (a.position > b.position ? 1 : -1))

      // Inject extra details into the channels
      .map(async (channel: TextChannel): Promise<Channel> => {
        const { parent, name, topic, id } = channel

        const permissions = await Permissions({ server, channel: id })
        const category = parent ? parent.name : null

        return { name, topic, id, category, permissions }
      })
  )

  // Filter the channels by whether they have the READ_MESSAGES permission
  return channels.filter(
    ({ permissions }) => (permissions ? permissions.READ_MESSAGES : false)
  )
}

export default memoize(Channels, {
  promise: true,
  maxAge: timestring(config.cache['graphql.channelsExpiration'], 'ms')
})
