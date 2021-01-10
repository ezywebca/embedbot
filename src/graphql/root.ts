import { client } from 'engine'

import server from './models/server'
import stats from './models/stats'

const root = {
  stats,
  server,
  invite: () =>
    `https://discordapp.com/oauth2/authorize?client_id=${
      client.user.id
    }&scope=bot&permissions=537218112`,
  authorize: () =>
    `https://discordapp.com/oauth2/authorize?client_id=${
      client.user.id
    }&scope=bot&permissions=537218112`
}

export default root
