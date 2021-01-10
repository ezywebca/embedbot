import { app, meta } from 'app'
import express from 'express'
import fs from 'fs'
import logger from 'logger'
import path from 'path'
import { configurator } from 'paths'
import request from 'request'

const index = path.join(configurator, 'index.html')
const serveStatic = fs.existsSync(index)

if (serveStatic) {
  app.use(express.static(configurator))
} else {
  logger.warn(
    `Couldn't find ${index}, proxying from WidgetBot.io`,
    meta('configurator')
  )
  app.use('/', (req, res) =>
    request(`https://widgetbot.io/${req.path}`).pipe(res)
  )
}
