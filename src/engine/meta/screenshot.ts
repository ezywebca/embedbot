import memoize from 'memoizee'
import { URL } from 'url'

enum Options {
  expiration = 12, // in hours
  width = 1200, // pixels
  height = 630 // pixels
}

const proxy = (url: string) =>
  `https://proxy.duckduckgo.com/iu/?f=1&u=${encodeURIComponent(
    `https://image.thum.io/get/noanimate/maxAge/${Options.expiration}/width/${
      Options.width
    }/crop/${Options.height}/${url}`
  )}`

const Screenshot = (url: string) => {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('height', `${Options.height}`)
    parsed.searchParams.set('width', `${Options.width}`)

    return proxy(parsed.href)
  } catch (e) {
    return proxy(url)
  }
}

export default memoize(Screenshot)
