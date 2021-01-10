import { Reaction } from '../../../types/message'
import * as Discord from 'discord.js'

function Role(role: Discord.Role) {
  return {
    name: role.name,
    color: role.hexColor,
    position: role.calculatedPosition
  }
}

export default Role
