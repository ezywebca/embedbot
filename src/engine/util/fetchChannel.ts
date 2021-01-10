import * as Discord from 'discord.js'
import { client } from 'engine'
import Messages from 'engine/messages'
import fetchInvite from 'engine/util/fetchInvite'
import memoize from 'memoizee'

/**
 * Fetches a channel, making sure there is sufficient permissions
 * @argument perms The permissions to check for. Always checks for 'VIEW_CHANNEL' and 'READ_MESSAGE_HISTORY' regardless
 */
async function fetchChannel(
  { server, channel }: { server: string; channel: string },
  perms: Discord.PermissionResolvable | Discord.PermissionResolvable[] = []
) {
  // Construct the permissions
  const permissions = perms
    ? ([
        'VIEW_CHANNEL',
        'READ_MESSAGE_HISTORY',
        ...(perms instanceof Array ? perms : [perms])
      ] as Discord.PermissionResolvable[])
    : null

  // Validate input
  if (typeof channel !== 'string') throw Messages.NO_CHANNEL
  if (typeof server !== 'string') throw Messages.NO_SERVER

  // If the bot is not in the guild
  const guild = client.guilds.get(server)
  if (!guild) throw Messages.BAD_SERVER

  // If the channel doesn't exist
  const textChannel = guild.channels.get(channel)
  if (!textChannel) throw Messages.BAD_CHANNEL

  // If the permissions are bad
  if (
    !permissions ||
    textChannel.permissionsFor(client.user).has(permissions)
  ) {
    return {
      guild: textChannel.guild,
      channel: textChannel as Discord.TextChannel,
      get permissions() {
        return textChannel.permissionsFor(client.user)
      },
      get invite() {
        return fetchInvite({ server, channel })
      }
    }
  }

  throw Messages.BAD_PERMISSIONS
}

export default memoize(fetchChannel, {
  promise: true,
  normalizer: args => JSON.stringify(args),
  maxAge: 5000
})
