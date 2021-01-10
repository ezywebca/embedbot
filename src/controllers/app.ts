import config from 'config'
import express from 'express'
import intercept from 'express-interceptor'
import RateLimit from 'express-rate-limit'
import expressWinston from 'express-winston'
import { Server } from 'http'
import logger, { Meta } from 'logger'
import initiate from 'socket-io'

import graphql from './api'
import interceptor from './express/interceptor'

export const app = express()
export const server = new Server(app)

// Rate limiter
export const limiter = new RateLimit({
  windowMs: 1,
  delayAfter: 0,
  ...(!config.development && config.express.rateLimit)
})

export const meta = Meta('Express')

app.set('trust proxy', 'loopback')
app.set('port', config.express.port)

// Middleware
app.use(intercept(interceptor))
if (['debug', 'silly'].includes(logger.level)) {
  app.use(
    expressWinston.logger({
      winstonInstance: logger,
      level: logger.level,
      transports: [],
      meta: logger.level === 'silly',
      msg: 'HTTP {{req.method}} {{req.url}}'
    })
  )
}
app.use('/api/graphql', limiter, graphql)

// Routes
import('app/routes/api/invite')
import('app/routes/api/authorize')

import('app/routes/api/server')

import('app/routes/embed')
import('app/routes/configurator')

export const io = initiate(server)

// Debugging
;(<any>global).io = io
;(<any>global).app = app
