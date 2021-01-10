import { Message } from 'discord.js'
import { client } from 'engine'
import { IArgs } from 'engine/commands/types'
import pipe from 'function-pipe'

import Help, { HelpWithCommand } from './help'
import Invite from './invite'
import Show from './show'
import Sudo from './sudo'

const replaceAll = (string, matches: string[], replace: string) => {
  let result = string
  matches.forEach(match => (result = result.split(match).join(replace)))
  return result
}

const removeMentions = string =>
  replaceAll(string, [`<@${client.user.id}>`, `<@!${client.user.id}>`], '')
const removeWhitespace = string => string.trim()
const splitCommands = string => string.split(/ (.*)/)
const toLowercase = (strings: string[]) => strings.map(s => s.toLowerCase())

const parse = pipe(removeMentions, removeWhitespace, splitCommands, toLowercase)
const getHandler = (command): ((payload: IArgs) => void) => {
  // prettier-ignore
  switch (command) {
    case 'show': return Show
    case 'sudo': return Sudo
    case 'help': return Help
    case 'invite': return Invite
    default: return null
  }
}

export const branding = {
  // description: `[**WidgetBot.io**](https://widgetbot.io): Discord widgets for your website\n_ _`
  // author: {
  //   name: 'WidgetBot.io: Discord widgets for your website',
  //   url: 'https://widgetbot.io'
  //   /icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
  // }
}

async function Commands(message: Message) {
  const [command, payload] = parse(message.content)
  const handler = getHandler(command || 'help')

  if (handler) {
    handler({ payload, message })
  } else {
    message.reply(...HelpWithCommand(command))
  }
}

export default Commands
