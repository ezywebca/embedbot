import extend from 'extend'
import fs from 'fs'
import yaml from 'node-yaml'
import path from 'path'
import * as paths from 'paths'

import Config from '../types/Config'

const config = extend(
  true,
  readConfigurationFile('config.base.yml'),
  readConfigurationFile('config.yml'),
  readConfigurationEnvironment()
) as Config

export default config

function readConfigurationEnvironment(): object {
  const env = process.env

  return {
    database: {
      jwt_secret: env.JWT_SIGNATURE_KEY
    },
    development: env.NODE_ENV && env.NODE_ENV === 'development',
    discord: {
      events: {
        logs: [env.LOG_SERVER_ID, env.LOG_CHANNEL_ID],
        status: [env.LOG_SERVER_ID, env.LOG_CHANNEL_ID]
      },
      admins:
        (env.ADMIN_ID && [env.ADMIN_ID]) ||
        (env.ADMIN_IDS && env.ADMIN_IDS.split(',')),
      token: env.DISCORD_TOKEN
    },
    express: {
      port: env.PORT
    }
  }
}

function readConfigurationFile(fileName: string): object | null {
  const filePath = path.join(paths.data, fileName)
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Configuration file not found: ${filePath}`)
    return null
  }

  console.log(`Loading configuration from ${filePath}…`)
  return yaml.readSync(filePath) || null
}
