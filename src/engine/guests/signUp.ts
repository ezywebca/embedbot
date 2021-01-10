import { Register } from 'database/guest'
import randomAvatar from 'engine/guests/randomAvatar'

import Guest from './guest'

export interface ISignUp {
  server: string
  name: string
  ip: string
}

async function SignUp({ server, name, ip }: ISignUp) {
  // Register the guest in the database
  const { doc, token } = await Register({
    name,
    avatar: randomAvatar(name)
  })

  // Instantiate the Guest
  const guest = new Guest({ server, token })

  // Authenticate the guest against the database
  await guest.login({ ip })

  return guest
}

export default SignUp
