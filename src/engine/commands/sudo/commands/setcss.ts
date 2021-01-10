import { IArgs } from 'engine/commands/types'
import { Update, Fetch } from 'database/server'

const isID = /^\d+$/

const setcolors = ({ payload, message }: IArgs) => {
  const serverID = payload.split(' ').shift()

  if (!isID.test(serverID)) {
    return message.reply('Server ID invalid!')
  }

  const css = message.content.split('```')[1].replace('\n', '')

  Fetch(serverID).then(oldStore => {
    const store = oldStore
    store.theme.css = css
    Update(serverID, store).then(() => {
      message.reply('Done!')
    })
  })
}

export default setcolors
