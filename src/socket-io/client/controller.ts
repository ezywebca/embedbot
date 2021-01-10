import config from 'config'
import { Guest } from 'engine/guests'
import { Notification } from 'react-notification-system'
import Stateful from 'stateful'

class Controller extends Stateful {
  socket: SocketIO.Socket
  guest: Guest

  /**
   * Sends the server's default announcements to the user
   */
  announcements() {
    if (config.embed.config.notifications) {
      config.embed.config.notifications.forEach(notification => {
        this.notify(notification as Notification)
      })
    }
  }

  /**
   * Notifies a message to the user
   * @param notification Notification to notify
   */
  notify(notification: Notification) {
    this.socket.emit('notify', notification)
  }

  /**
   * Returns a room for a given request
   * @param data
   */
  getRoom(channel: string) {
    if (typeof channel === 'string') {
      return {
        room: `${this.state.server}/${channel}`,
        channel
      }
    }

    throw {
      title: `Invalid subscription request!`,
      message: `Requests should contain the channel ID as a string`
    }
  }
}

export default Controller
