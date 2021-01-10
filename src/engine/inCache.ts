import { cache } from 'engine'

function inCache(
  { guild, channel },
  callback: ({ server, channel }: { server: string; channel: string }) => void
) {
  if (guild && channel) {
    const shard = {
      server: guild.id,
      channel: channel.id
    }
    if (cache.inCache(shard)) {
      return callback(shard)
    }
  }
}

export default inCache
