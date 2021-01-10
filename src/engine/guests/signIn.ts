import Guest from './guest'

export interface ISignIn {
  server: string
  token: string
  ip: string
}

async function SignIn({ server, token, ip }: ISignIn) {
  // Instantiate the Guest
  const guest = new Guest({ server, token })

  // Authenticate the guest against the database
  await guest.login({ ip })

  return guest
}

export default SignIn
