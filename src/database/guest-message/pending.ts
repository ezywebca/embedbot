import { enhanceMessage } from 'database/guest-message'
import GuestMessage from 'database/models/GuestMessage'

import sleep from '../../modules/sleep'
import Message from '../../types/message'

/**
 * This is an asynchronous Promise-like resolver.
 *
 * Because the message events are called out of order
 * this module attempts to fix that.
 */

let pendings = new Map<
  string,
  {
    resolve: Function
    enhancer: (message: Message) => Promise<Message>
  }
>()

export const instantate = (id: string) => {
  // Remove leading and trailing spaces
  id = id.trim()

  pendings.set(id, {
    async resolve(data) {
      while (true) {
        if (this._resolve) {
          this._resolve(enhanceMessage(this._message, data))
          break
        } else {
          await sleep(5)
        }
      }
    },
    enhancer(message) {
      return new Promise(resolve => {
        this._resolve = resolve
        this._message = message
      })
    }
  })
}

export const is = (id: string) => pendings.get(id)

export const resolve = (id: string, enhancer: GuestMessage) => {
  const pending = pendings.get(id)
  if (pending) {
    pending.resolve(enhancer)
    pendings.delete(id)
    return true
  }
  return false
}
