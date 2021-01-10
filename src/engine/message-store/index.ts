import config from 'config'
import { ChannelLogsQueryOptions, Collection } from 'discord.js'

import Message, { Reaction } from '../../types/message'
import fetchChannel from '../util/fetchChannel'
import Parse from '../util/parse'

type MessageCollection = Collection<string, Message>
type ChannelCollection = Collection<string, MessageCollection>
type GuildCollection = Collection<string, ChannelCollection>
type Store = GuildCollection

interface Request {
  server: string
  channel: string
}

class MessageStore {
  store: Store = new Collection()

  /**
   * Returns whether a server + channel is in cache
   */
  inCache({ server, channel }: Request) {
    if (this.store.has(server)) {
      const channelStore = this.store.get(server)
      if (channelStore.has(channel)) return true
    }
    return false
  }

  /**
   * Pushes a message to the store
   */
  async pushMessage(req: Request, message: Message) {
    try {
      const messageStore = await this.fetchChannel(req)
      messageStore.set(message.id, message)
      if (messageStore.size > config.cache['graphql.messageHistory']) {
        messageStore.delete(messageStore.firstKey())
      }
    } catch (e) {
      // Ok. Channel is not in cache
    }
  }

  /**
   * Edits a message in the store
   */
  async editMessage(req: Request, message: Message) {
    try {
      const messageStore = await this.fetchChannel(req)
      messageStore.set(message.id, message)
    } catch (e) {
      // Ok. Channel is not in cache
    }
  }

  async addReaction(req: Request, id: string, reaction: Reaction) {
    try {
      const messageStore = await this.fetchChannel(req)
      const message = messageStore.get(id)
      if (message) {
        if (!message.reactions) message.reactions = []

        const sameReaction = message.reactions.find(
          r => r.id === reaction.id && r.name === reaction.name
        )

        if (sameReaction) {
          sameReaction.count = reaction.count
        } else {
          message.reactions.push(reaction)
        }
      }
    } catch (e) {
      // Ok. Channel is not in cache
    }
  }

  async removeReaction(
    req: Request,
    id: string,
    reactions: Reaction | Reaction[]
  ) {
    try {
      if (!(reactions instanceof Array)) reactions = [reactions]

      const messageStore = await this.fetchChannel(req)
      const message = messageStore.get(id)

      if (message && message.reactions) {
        for (let reaction of reactions) {
          message.reactions = message.reactions.filter(
            r => !(r.id === reaction.id && r.name === reaction.name)
          )
        }
      }
    } catch (e) {
      // Ok. Channel is not in cache
    }
  }

  /**
   * Deletes a message from the store
   */
  async deleteMessage(req: Request, ids: string | string[]) {
    if (!(ids instanceof Array)) ids = [ids]

    try {
      const messageStore = await this.fetchChannel(req)
      for (let id of ids) {
        messageStore.delete(id)
        this.cacheMessages(req, { limit: 1, before: messageStore.last().id })
      }

      // Re-inflate cache
      // TODO: This is broken for some reason
      // maybe it happens too fast?
      await this.cacheMessages(req)
    } catch (e) {
      // Ok. Channel is not in cache
    }
  }

  /**
   * Fetches the messages for a channel
   */
  async getMessages({ server, channel }: Request) {
    // Add the server to the store
    if (!this.store.has(server)) {
      this.store.set(server, new Collection())
    }

    // Fetch the channel store
    const channelStore = this.store.get(server)

    // If the channel is not cached, fetch the messages
    if (!channelStore.has(channel)) {
      const messages = await this.cacheMessages({ server, channel })
      channelStore.set(channel, messages)

      return messages.map(m => m)
    }

    return channelStore.get(channel).map(m => m)
  }

  /**
   * Caches the messages for a channel
   */
  async cacheMessages(req: Request, options: ChannelLogsQueryOptions = {}) {
    const { channel } = await fetchChannel(req)

    const messages = await channel.fetchMessages({
      limit: options.limit || config.cache['graphql.messageHistory'],
      ...options
    })

    const collection = new Collection() as MessageCollection

    // Iterate through the messages in reverse order
    const sortedMessages = messages.map(m => m).reverse()

    for (let message of sortedMessages) {
      collection.set(message.id, await Parse(message))
    }

    return collection
  }

  private async fetchChannel({ server, channel }: Request) {
    if (this.store.has(server)) {
      const channelStore = this.store.get(server)
      if (channelStore.has(channel)) {
        return channelStore.get(channel)
      }
      throw 'Channel not in cache'
    }
    throw 'Server not in cache'
  }
}

export default MessageStore
