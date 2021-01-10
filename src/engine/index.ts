import config from 'config'
import { Client } from 'discord.js'
import async from 'doasync'
import Commands from 'engine/commands'
import inCache from 'engine/inCache'
import options from 'engine/options'
import PlayingStatus from 'engine/util/playing-status'
import logger, { Meta } from 'logger'

import { io } from '../controllers/app'
import Guests from './guests'
import MessageStore from './message-store'
import Parse from './util/parse'

export const client = new Client(options)
export const cache = new MessageStore()
export const guests = new Guests()

export async function Login(token: string) {
  const meta = Meta('Discord')

  client.login(token)
  await async(client).on('ready')

  // Start toggling playing status
  if (config.discord.statuses && config.discord.statuses.length)
    PlayingStatus.start()
  else client.user.setPresence({ game: null })

  /**
   * Message events
   */
  client.on('message', data => {
    // Command engine
    if (data.mentions.users.has(client.user.id)) Commands(data)

    inCache(data, async ({ server, channel }) => {
      const message = await Parse(data)
      cache.pushMessage({ server, channel }, message)

      io.to(`${server}/${channel}`).emit('message', {
        channel,
        message
      })
    })
  })

  /**
   * Message edit events
   */
  client.on('messageUpdate', (_, data) => {
    inCache(data, async ({ server, channel }) => {
      const message = await Parse(data)
      cache.editMessage({ server, channel }, message)

      io.to(`${server}/${channel}`).emit('messageUpdate', {
        channel,
        message
      })
    })
  })

  /**
   * Message delete events
   */
  client.on('messageDelete', data => {
    inCache(data, async ({ server, channel }) => {
      cache.deleteMessage({ server, channel }, data.id)

      io.to(`${server}/${channel}`).emit('messageDelete', {
        channel,
        id: data.id
      })
    })
  })

  client.on('messageDeleteBulk', messages => {
    const data = messages.first()

    inCache(data, async ({ server, channel }) => {
      const ids = messages.map(message => message.id)

      cache.deleteMessage({ server, channel }, ids)

      io.to(`${server}/${channel}`).emit('messageDeleteBulk', {
        channel,
        ids
      })
    })
  })

  /**
   * Message reaction events
   */
  client.on('messageReactionAdd', data => {
    const { message } = data

    inCache(message, async ({ server, channel }) => {
      const reaction = {
        name: data.emoji.name,
        id: data.emoji.id,
        count: data.count
      }

      cache.addReaction({ server, channel }, message.id, reaction)

      io.to(`${server}/${channel}`).emit('messageReactionAdd', {
        channel,
        id: message.id,
        reaction
      })
    })
  })

  client.on('messageReactionRemove', data => {
    const { message } = data

    inCache(message, async ({ server, channel }) => {
      const reaction = {
        name: data.emoji.name,
        id: data.emoji.id,
        count: data.count
      }

      cache.removeReaction({ server, channel }, message.id, reaction)

      io.to(`${server}/${channel}`).emit('messageReactionRemove', {
        channel,
        id: message.id,
        reaction
      })
    })
  })

  /**
   * Join events
   */
  client.on('guildCreate', guild => {
    logger.info(`Joined server`, {
      ...meta('join'),
      discord: 'logs',
      name: guild.name,
      memberCount: guild.memberCount,
      id: guild.id
    })
  })

  client.on('guildDelete', guild => {
    logger.info(`Left server`, {
      ...meta('kick'),
      discord: 'logs',
      name: guild.name,
      memberCount: guild.memberCount,
      id: guild.id
    })
  })

  return client
}

// Debugging
;(<any>global).cache = cache
;(<any>global).client = client
;(<any>global).guests = guests
