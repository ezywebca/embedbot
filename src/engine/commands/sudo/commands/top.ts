import { Message } from 'discord.js'
import stats from 'socket-io/util/stats'
import { IArgs } from 'engine/commands/types'

const format = ([server, count]) =>
  `\`${count}\` [${server}](https://widgetbot.io/channels/${server})`
const join = (servers: [string, number][]) =>
  servers.reduce((prev, server) => `${prev}${format(server)}\n`, '')

const top = ({ message }: IArgs) => {
  const { servers } = stats()

  message.reply('', {
    embed: {
      title: `Servers listed by online guest count`,
      description: join(servers.slice(0, 20))
    }
  })
}

export default top
