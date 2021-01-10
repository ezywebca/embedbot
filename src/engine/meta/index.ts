import { TextChannel } from 'discord.js'
import { client } from 'engine'
import memoize from 'memoizee'

import generator from './generator'
import Screenshot from './screenshot'

async function metaTags(req: {
  server?: string
  channel?: string
  url: string
}) {
  const screenshot = Screenshot(req.url)

  if (req.server) {
    const guild = client.guilds.get(req.server)

    if (guild) {
      const description = `There are ${
        guild.memberCount
      } members in this server`

      if (req.channel) {
        const channel = guild.channels.get(req.channel) as TextChannel

        if (channel) {
          return generator({
            title: `#${channel.name} - ${guild.name}`,
            description: channel.topic || description,
            image: screenshot
          })
        }
      }

      return generator({
        title: `${guild.name}`,
        description,
        image: screenshot
      })
    }
  }

  return generator()
}

export default memoize(metaTags, {
  promise: true,
  maxAge: 10 * 60 * 1000,
  normalizer: args => JSON.stringify(args)
})
