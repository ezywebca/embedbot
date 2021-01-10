import { client } from 'engine'
import Messages from 'engine/messages'
import memoize from 'memoizee'

/**
 * Fetches an invite for a server (with an optional channel)
 */
async function fetchInvite(req: { server: string; channel?: string }) {
  const guild = client.guilds.get(req.server)

  if (guild) {
    let channel = guild.channels.get(req.channel)

    // If the channel doesn't exist, or we don't have
    // permission to create an invite on it,
    // fallback to a random channel with permission
    if (
      !channel ||
      !channel.permissionsFor(client.user).has('CREATE_INSTANT_INVITE')
    ) {
      channel = guild.channels.find(
        channel =>
          channel.type === 'text' &&
          channel.permissionsFor(client.user).has('CREATE_INSTANT_INVITE')
      )
    }

    if (channel) {
      const invite = await channel.createInvite({
        temporary: false,
        maxAge: 0,
        unique: false
      })

      return invite.url
    }

    throw Messages.BAD_CHANNEL
  }

  throw Messages.BAD_SERVER
}

export default memoize(fetchInvite, {
  promise: true,
  normalizer: args => JSON.stringify(args)
})
