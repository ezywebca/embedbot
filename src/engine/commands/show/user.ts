import { flag } from 'country-emoji'
import geoip from 'geoip-lite'

const emoji = (ip: string) => {
  const details = geoip.lookup(ip)
  return details ? flag(details.country) : ''
}

interface IUser {
  online: boolean
  name: string
  id: string
  avatar: string
  messageCount: number
  ip: string
  lastSeen?: Date
}

const User = (data: IUser) => ({
  embed: {
    // title: 'IP: 127.0.0.1',
    description: `This guest has sent ${data.messageCount} messages.`,
    // url: 'https://discordapp.com',
    color: data.online ? 65325 : 16711680,
    timestamp: data.lastSeen || null,
    footer: {
      // icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      text: data.online
        ? 'Online'
        : `Offline${data.lastSeen ? `; Last signed in` : ''}`
    },
    thumbnail: {
      url: data.avatar
    },
    author: {
      name: data.name,
      url: `https://widgetbot.io/actions/report/${data.id}`
      // icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    },
    fields: [
      {
        name: 'IP Address',
        value: `[${emoji(data.ip)} ${
          data.ip
        }](https://www.iplocation.net/?query=${data.ip})`,
        inline: true
      },
      {
        name: 'Actions',
        value:
          '[:no_entry:](https://widgetbot.io/actions/ban) ' +
          '[:mute:](https://widgetbot.io/actions/mute) ' +
          `[:speak_no_evil:](https://widgetbot.io/actions/report/${data.id}) `,
        inline: true
      }
    ]
  }
})

export default User
