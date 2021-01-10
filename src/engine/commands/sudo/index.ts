import { list } from '../list'
import config from 'config'

import { IArgs } from '../types'

const isAdmin = (id: string) => config.discord.admins.includes(id)

async function Invite({ payload, message }: IArgs) {
  if (!isAdmin(message.author.id))
    return message.reply(
      `Unauthorised! only server admins can use this command`
    )

  if (list.hasOwnProperty(payload)) {
    return list[payload].default(message)
  }

  message.reply(
    `Unable to locate command! Available commands:` +
      '```json\n' +
      JSON.stringify(Object.keys(list), null, 2) +
      '```'
  )
}

export default Invite
