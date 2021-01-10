import config from 'config'
import crypto from 'crypto'
import memoize from 'memoizee'

const { avatar } = config.embed.config

enum Config {
  size = 400
}

const randomAvatar = (username: string) => {
  const hash = encodeURIComponent(
    crypto
      .createHash('md5')
      .update(username)
      .digest('hex')
  )

  return avatar === 'adorable'
    ? `https://api.adorable.io/avatars/${Config.size}/${hash}.png`
    : ['robohash', 'identicon', 'retro'].includes(avatar)
      ? `https://www.gravatar.com/avatar/${hash}?s=${
          Config.size
        }&d=${encodeURIComponent(avatar)}`
      : avatar
}

export default memoize(randomAvatar)
