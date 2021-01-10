import config from 'config'
import { client } from 'engine'
import Merge from 'engine/permissions/merge'
import fetchChannel from 'engine/util/fetchChannel'
import memoize from 'memoizee'
import timestring from 'timestring'

import rolePerms from './rolePerms'

async function Permissions(req: { server: string; channel: string }) {
  const { guild, channel } = await fetchChannel(req, null)

  // Fetch permissions
  const bot = await rolePerms({
    ...req,
    snowflake: client.user.id
  })

  const everyone = await rolePerms({
    ...req,
    snowflake: guild.roles.find(({ name }) => name === '@everyone').id
  })

  // Merge the permissions
  const permissions = Merge(bot, everyone)

  return permissions
}

export default memoize(Permissions, {
  promise: true,
  maxAge: timestring(config.cache['graphql.permissionsExpiration'], 'ms'),
  normalizer: args => JSON.stringify(args)
})

// Debugging
if (global) {
  ;(global as any).Permissions = Permissions
  ;(global as any).rolePerms = rolePerms
}
