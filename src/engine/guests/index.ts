import * as Discord from 'discord.js'

import Guest from './guest'
import SignIn, { ISignIn } from './signIn'
import SignUp, { ISignUp } from './signUp'

type ICreate = ISignIn & { type: 'signIn' } | ISignUp & { type: 'signUp' }

class Guests {
  public servers = new Map<string, Map<string, Guest>>()

  /**
   * Creates a new guest, either from an existing token
   * or by creating a new guest in the database.
   */
  async create(req: ICreate) {
    const guest = await (req.type === 'signUp' ? SignUp(req) : SignIn(req))

    // Store guest in guests map
    const server = this.getServer(req)
    server.set(guest.id, guest)

    return guest
  }

  private getServer({ server }) {
    if (!this.servers.has(server)) {
      this.servers.set(server, new Discord.Collection())
    }

    return this.servers.get(server)
  }
}

export { default as Guest } from './guest'

export default Guests
