import is from '@sindresorhus/is'
import { guests } from 'engine'
import fetchInvite from 'engine/util/fetchInvite'
import logger, { Meta } from 'logger'

import Message from '../../types/message'
import { State } from '../../types/socket'
import Controller from './controller'
import Messages from './messages'
import * as Parse from './parse'
import { sendErrors } from './util'

const meta = Meta('Socket')

class SocketController extends Controller {
  public state: State = {
    ip: null,
    registered: false,
    server: null,
    channel: null,
    subscriptions: new Set(),
    typing: false
  }

  constructor(socket: SocketIO.Socket) {
    super()
    this.socket = socket

    const ip =
      socket.handshake.headers['x-real-ip'] || socket.conn.remoteAddress
    this.setState({ ip })

    // Flows
    socket.on('register', this.register.bind(this))
    socket.on('signUp', this.handleSignUp.bind(this))

    // Message events
    socket.on('sendMessage', this.handleMessage.bind(this))
    socket.on('typing', this.typing.bind(this))

    // Interactive events
    socket.on('invite', this.invite.bind(this))

    // Channel subscriptions
    socket.on('subscribe', this.handleSubscription('subscribe'))
    socket.on('unsubscribe', this.handleSubscription('unsubscribe'))

    this.announcements()

    logger.verbose(`Guest connected`, { ...meta(), ip })
  }

  /**
   * Socket register event
   */
  @sendErrors({ title: Messages.FAILED_REGISTER })
  async register(data) {
    if (this.state.registered) return

    const { token, server, subscriptions } = await Parse.register(data)
    this.setState({ server, registered: true })

    // Re-subscribe to previous subscriptions
    subscriptions.forEach(channel => {
      if (is.string(channel)) {
        const { room } = this.getRoom(channel)
        this.state.subscriptions.add(channel)
        this.socket.join(room)
      }
    })

    // Authenticate the user
    if (token) {
      this.signIn(token)
    }
  }

  /**
   * Sends a message as the user
   */
  async sendMessage({ channel, message }) {
    if (this.guest) {
      logger.verbose(`Guest sent message`, {
        ...meta('sendMessage'),
        channel,
        content: message
      })
      return await this.guest.sendMessage(channel, message)
    }

    throw 'You need to be signed in to send messages'
  }

  /**
   * Signs the user up
   */
  async signUp({ name }: Parse.ISignUp) {
    const { server, ip } = this.state
    this.guest = await guests.create({ type: 'signUp', server, name, ip })

    const { token, avatar, id, type } = this.guest
    const user = { name, token, avatar, type, id }

    this.socket.emit('signIn', user)

    logger.verbose(`Guest signed up`, { ...meta('signUp'), name, type, id })
    return user
  }

  /**
   * Signs the user in
   */
  @sendErrors({ title: Messages.FAILED_SIGNIN })
  async signIn(token: string) {
    const { server, ip } = this.state
    this.guest = await guests.create({ type: 'signIn', server, ip, token })

    const { name, avatar, id, type } = this.guest
    const user = { name, token, avatar, type, id }

    this.socket.emit('signIn', user)

    logger.verbose(`Guest signed in`, { ...meta('signIn'), name, type, id })
    return user
  }

  /**
   * Deliver a message to the client
   * @param channel The channel to deliver it on
   * @param message The message to deliver
   */
  message(channel: string, message: Message) {
    this.socket.emit('message', { channel, message })
  }

  /* ------------------------------------------ */

  /**
   * User typing status
   */
  private typing(data) {
    if (!this.guest) return

    if (
      data instanceof Object &&
      typeof data.channel === 'string' &&
      typeof data.typing === 'boolean'
    ) {
      const { channel, typing } = data

      // Stop typing on previous channel
      if (this.state.typing) {
        this.guest.stopTyping(channel)
      }

      // Start typing on channel
      if (typing) {
        this.guest.startTyping(channel)
      }

      // Update state
      this.setState({ typing: typing ? channel : false })

      logger.verbose(`Guest typing status changed`, {
        ...meta('typing'),
        channel,
        typing
      })
    }
  }

  /**
   * Invite handler
   */
  @sendErrors({ title: Messages.FAILED_INVITE })
  private async invite(data, callback) {
    const { channel } = await Parse.invite(data)

    try {
      const invite = await fetchInvite({ server: this.state.server, channel })
      logger.verbose(invite, meta('invite'))
      callback(invite)
    } catch (error) {
      callback(null)
      throw error
    }
  }

  /**
   * Message handler
   */
  @sendErrors({ title: Messages.FAILED_MESSAGE })
  private async handleMessage(data, callback) {
    const { channel, message } = await Parse.message(data)

    const { id } = await this.sendMessage({ channel, message })

    this.guest.stopTyping(channel)

    callback(id)
  }

  /**
   * Sign in handler
   */
  @sendErrors({ title: Messages.FAILED_SIGNUP })
  private async handleSignUp(data) {
    if (this.guest) return

    const { name } = await Parse.signUp(data)
    const sanitizedName = name.replace(/`/g, `'`).replace(/\n/g, ``)

    await this.signUp({ name: sanitizedName })
  }

  /**
   * Socket.io subscription handler
   */
  private handleSubscription = (
    type: 'subscribe' | 'unsubscribe'
  ) => async data => {
    try {
      const { channel, room } = this.getRoom(data)
      const method: string = type === 'subscribe' ? 'join' : 'leave'
      this.socket[method](room)

      if (type === 'subscribe') {
        this.state.subscriptions.add(channel)
      } else {
        this.state.subscriptions.delete(channel)
      }
    } catch (error) {
      this.notify({
        level: 'warning',
        autoDismiss: 0,
        ...error
      })
    }
  }
}

export default SocketController
