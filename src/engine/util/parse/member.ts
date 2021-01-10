import { GuildMember } from 'discord.js'
import { Reaction } from '../../../types/message'
import Roles from 'engine/util/parse/roles'

async function Member(member: GuildMember) {
  return member
    ? {
        name: `${member.displayName}#${member.user.discriminator}`,
        color: member.displayHexColor,
        roles: await Roles(member.roles.array())
      }
    : {
        roles: null,
        color: '#000000'
      }
}

export default Member
