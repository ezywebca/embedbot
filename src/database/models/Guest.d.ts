export interface JWT {
  id: string
}

export interface User {
  // The guest's chosen name
  name: string
  // The guest's generated ID / Discord ID
  id: string
  // URL to the guests avatar
  avatar: string
}

export interface Log {
  // IP addresses the guest has signed in with
  ips: string[]

  // ID's of the messages the guest has sent
  messages: string[]

  // Time of last sign in
  lastSeen: Date
}

interface Guest {
  // User's data
  user: User

  // User's activity log
  log: Log

  // Whether the user has signed in with Discord
  discord: boolean
}

export default Guest
