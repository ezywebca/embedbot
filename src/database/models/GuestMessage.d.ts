import { Message } from 'discord.js'

interface GuestMessage {
  // Guest
  user: {
    // Guest name
    name: string
    // Guest ID
    id: string
    // Guest avatar
    avatar: string
  }

  // Message ID
  id: string
}

export default GuestMessage
