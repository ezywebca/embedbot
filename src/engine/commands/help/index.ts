import { MessageOptions } from 'discord.js'
import { branding } from 'engine/commands'

import { IArgs } from '../types'
import { commands, Command } from './commands'
import parseArgs from './parseArgs'
import parseExamples from './parseExamples'

const parseCommand = ([name, help]: Command) => ({
  name: `:gear: ${name}: ${help.info}`,
  value: `${
    help.args ? `:information_source: **Params:** ${parseArgs(help.args)}` : ''
  }\n${help.examples ? parseExamples(name, help.examples) : ''}\n_ _`,
  inline: false
})

export function HelpWithCommand(commandName: string): [string, MessageOptions] {
  const command =
    typeof commandName === 'string' &&
    commands.find(([name]) => name === commandName)

  return [
    command ? 'invalid usage of command!' : 'unknown command!',
    {
      embed: {
        ...branding,
        fields: command ? [parseCommand(command)] : commands.map(parseCommand),
        color: command ? 16722474 : 7570887
      }
    }
  ]
}

async function Help({ payload, message }: IArgs) {
  // message.reply('here are my available commands:', {
  //   embed: {
  //     ...branding,
  //     fields: commands.map(parseCommand),
  //     color: 7570887
  //   }
  // })
}

export default Help
