import 'source-map-support/register'

import config from 'config'
import DiscordTransport from 'engine/winston-transport'
import raven from 'raven'
import { Logger, transports } from 'winston'
import wcf from 'winston-console-formatter'

// Pretty print unhandled rejections
process.on('unhandledRejection', promise => console.error(promise))

// Raven
{
  const token = 'https://92da74f1b4a842ec8f3580ee115c83d1@sentry.io/1207917'
  raven.disableConsoleAlerts()
  raven.config(!config.development && token).install()
}

export const Meta = (name: string) => (method?: string) => ({
  from: `${name}${method ? `:${method}` : ''}`
})

const { formatter } = wcf()

const logger = new Logger({
  level: config.log_level,
  transports: [
    new DiscordTransport({}),
    new transports.Console({
      formatter
    })
  ]
})

logger.debug(`Logging initialized at ${logger.level} level`)

export default logger
;(global as any).logger = logger
