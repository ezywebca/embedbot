import is from '@sindresorhus/is'
import config from 'config'
import fetchChannel from 'engine/util/fetchChannel'
import yaml from 'js-yaml'
import * as _ from 'lodash'
import * as winston from 'winston'

import Config from '../../types/Config'

type Event = keyof Config['discord']['events']

interface IMeta {
  discord: Event
}

enum Colors {
  error = 16721408,
  warn = 16762368,
  info = 55610,
  verbose = 16723056,
  debug = 50631,
  silly = 14383124
}

class DiscordTransport extends winston.Transport {
  constructor(options) {
    super()
  }

  async log(level: string, message, meta, callback) {
    try {
      const { discord, embed } = meta

      delete meta.discord
      delete meta.embed

      const { channel } = await this.fetch(discord)

      const metadata = _.omit(meta, ['from'])
      const yml = Object.keys(metadata).length
        ? '```yaml\n' + yaml.safeDump(metadata) + '```'
        : ''

      const customEmbed = is.function_(embed) ? embed(meta) : embed

      channel.send('', {
        embed: customEmbed || {
          title: `[${level.toUpperCase()}] ${meta.from || ''}`,
          color: Colors[level],
          description: _.capitalize(message) + yml
        }
      })
    } catch (e) {}

    callback(null, true)
  }

  private fetch(name: Event) {
    if (!name) throw false
    const event = config.discord.events[name]
    if (!event) throw 'Unknown event'

    const [server, channel] = event
    return fetchChannel({ server, channel })
  }
}

export default DiscordTransport
