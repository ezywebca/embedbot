import os from 'os'
import osName from 'os-name'
import prettyBytes from 'pretty-bytes'
import prettyMs from 'pretty-ms'

const name = osName(os.platform(), os.release())

const free = os.freemem()
const total = os.totalmem()

const usage = ((1 - free / total) * 100).toFixed()

const startup = ({ durationMs }) => ({
  description: `Logged into Discord • took ${prettyMs(durationMs)}`,
  color: 16737537,
  timestamp: new Date(),
  footer: {
    text: name
  },

  author: {
    name: 'WidgetBot server'
  },
  fields: [
    {
      name: 'Memory',
      value: `**${usage}%** @ __${
        prettyBytes(total - free).split(' ')[0]
      }__/${prettyBytes(total)}`,
      inline: true
    },
    {
      name: 'Node',
      value: `<:node:451466044322873354> ${process.versions.node}`,
      inline: true
    }
  ]
})

export default startup
