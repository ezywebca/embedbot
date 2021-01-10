import { Role, Collection } from 'discord.js'

async function Roles(roles: Role[]) {
  const parsed = roles.map(role => ({
    name: role.name,
    color: role.hexColor,
    position: role.position,
    id: role.id
  }))

  return parsed
}

export default Roles
