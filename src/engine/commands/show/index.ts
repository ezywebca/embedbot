import { Lookup } from 'database/guest'
import { HelpWithCommand } from 'engine/commands/help'

import { IArgs, IHelp } from '../types'
import User from './user'

export const help: IHelp = {
  info: `Retrieve info about a guest`,
  args: [['ip address', 'message id', 'guest id']],
  examples: ['11.33.77.89', '449658837813952512']
}

const getMethod = (string: string) =>
  string.includes('.') ? 'ip' : string.includes('-') ? 'id' : 'message'
const code = (string: string) => `\`${string.split('`').join(`'`)}\``

async function Show({ payload, message }: IArgs) {
  if (!payload) return message.reply(...HelpWithCommand('show'))
  const method = getMethod(payload)

  const description = `${method === 'message' ? 'message' : 'guest'} with ${
    method === 'ip' ? 'IP' : 'ID'
  }`

  try {
    const guest = await Lookup(method, payload)
    message.reply(`found ${description} ${code(payload)}`, {
      ...User({
        ip: guest.log.ips.slice(-1).pop(),
        id: guest.user.id,
        name: guest.user.name,
        online: false,
        messageCount: guest.log.messages.length,
        lastSeen: guest.log.lastSeen || null,
        avatar: guest.user.avatar
      })
    })
  } catch (e) {
    message.reply(`Couldn't find ${description} ${code(payload)}!`)
  }
}

export default Show
