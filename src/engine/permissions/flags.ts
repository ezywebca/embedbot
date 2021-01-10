import { PermissionObject, Permissions, PermissionString } from 'discord.js'

const flags = new Map<PermissionString, boolean>()
const keys = Object.keys(Permissions.FLAGS)

for (let key of keys) {
  flags.set(key as PermissionString, null)
}

export default flags
