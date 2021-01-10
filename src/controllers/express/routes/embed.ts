import { app, meta } from 'app'
import fs from 'fs'
import logger from 'logger'
import path from 'path'
import { embed } from 'paths'
import request from 'request'

const index = path.join(embed, 'index.html')
const serveStatic = fs.existsSync(index)

if (!serveStatic) {
  logger.warn(
    `Couldn't find ${index}, proxying from WidgetBot.io`,
    meta('embed')
  )
}

app.use('/channels/', (req, res) => {
  if (serveStatic) {
    return res.sendFile(path.join(embed, req.path), {}, err => {
      if (err) res.sendFile(index)
    })
  }

  request(`https://widgetbot.io/channels${req.path}`).pipe(res)
})
