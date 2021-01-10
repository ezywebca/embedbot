import { IArgs, IHelp } from '../types'

export const help: IHelp = {
  info: `WidgetBot support server`
}

async function Invite({ payload, message }: IArgs) {
  message.reply('https://discord.gg/zyqZWr2')
}

export default Invite
