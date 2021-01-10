import './util/stats'

import socket from 'socket.io'

import SocketController from './client'

const initiate = server => {
  const io = socket(server, { path: '/api/socket-io' })

  io.on('connection', socket => new SocketController(socket))

  return io
}

export default initiate
