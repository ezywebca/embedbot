import { PermissionObject } from 'discord.js'

/**
 * Merges permissions into one
 * @param bot The permissions for the bot on the channel
 * @param role The permissions for a role on the channel
 * @param everyone The permissions for @everyone on the channel
 */
function Merge(bot: PermissionObject, everyone: PermissionObject) {
  const user = everyone

  // If the bot can't send messages, the user can't either
  if ((bot.SEND_MESSAGES === bot.MANAGE_WEBHOOKS) === false)
    user.SEND_MESSAGES = false

  // If the bot can / can't read messages, the user can / can't either
  if (bot.READ_MESSAGES !== null) user.READ_MESSAGES = bot.READ_MESSAGES

  // If the bot is set to be allowed to send messages, make it so
  if (bot.SEND_MESSAGES !== null) user.SEND_MESSAGES = bot.SEND_MESSAGES

  return user
}

export default Merge
