import config from 'config'
import { Fetch } from 'database/server'
import { cache, client } from 'engine'
import Messages from 'engine/messages'
import fetchInvite from 'engine/util/fetchInvite'

import { Icons } from '../../../modules/assets'
import Channels from './channels'

async function Server({ id: server }) {
  const guild = client.guilds.get(server)
  if (!guild) throw Messages.BAD_SERVER

  const channels = await Channels(server)

  return {
    config: () => config.embed.config,
    async theme() {
      const storage = await Fetch(server)
      return storage.theme
    },
    name: guild.name,
    async invite() {
      try {
        return await fetchInvite({ server })
      } catch (e) {
        return null
      }
    },
    memberCount: guild.memberCount,
    icon: guild.iconURL || Icons.discord,
    channels,
    async channel({ id: channel }) {
      const textChannel = channels.find(({ id }) => id === channel)

      if (!textChannel) throw Messages.BAD_CHANNEL

      return {
        ...textChannel,
        messages: await cache.getMessages({ server, channel })
      }
    }
  }
}

export default Server
