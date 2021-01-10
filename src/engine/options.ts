import config from 'config'
import { ClientOptions } from 'discord.js'

const options: ClientOptions = {
  messageCacheMaxSize: config.cache['graphql.messageHistory'],
  messageSweepInterval: 10,
  disabledEvents: [
    'CHANNEL_PINS_UPDATE',
    'GUILD_BAN_ADD',
    'GUILD_BAN_REMOVE',
    'PRESENCE_UPDATE',
    'USER_NOTE_UPDATE',
    'VOICE_SERVER_UPDATE',
    'VOICE_STATE_UPDATE'
  ]
}

export default options
