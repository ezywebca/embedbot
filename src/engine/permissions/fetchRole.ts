import { client } from 'engine'

function fetchRole({ serverID, roleID }: { serverID: string; roleID: string }) {
  if (!client.guilds.has(serverID)) {
    return undefined
  }

  const guild = client.guilds.get(serverID)
  const role = guild.roles.find(role => role.id === roleID)
  return role
}

export default fetchRole
