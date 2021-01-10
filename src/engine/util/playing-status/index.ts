import config from 'config'
import { client } from 'engine'
import template from 'engine/util/playing-status/template'

import getContext from './context'

const interval = 60 * 1000

/**
 * Status controller
 */
namespace PlayingStatus {
  const { statuses } = config.discord
  let timer
  let position = -1

  /**
   * Starts toggling the playing status after a set period of time
   * @param time Optionally override the timeout between changes
   */
  export function start(time: number = interval) {
    // Stop previous timer
    stop()

    // Set initial status
    toggle()

    // Change status every X ms
    timer = setInterval(toggle, time)
  }

  /**
   * Toggles the playing status to the next iteration
   */
  export async function toggle() {
    position++
    if (position === statuses.length) position = 0

    const context = await getContext()
    const status = template(statuses[position], context)

    client.user.setPresence({ game: { name: status } })
  }

  /**
   * Stops toggling the playing status
   */
  export function stop() {
    clearInterval(timer)
  }
}

export default PlayingStatus
;(global as any).PlayingStatus = PlayingStatus
