import html from 'html-template-tag'
import memoize from 'memoizee'

import Screenshot from './screenshot'

interface metadata {
  appName?: string
  title?: string
  image?: string
  type?: string
  keywords?: string[]
  twitter?: string
  language?: string
  description?: string
  author?: string
  url?: string
  copyright?: string
  email?: string
}

const generator = (metadata: metadata = {}) => {
  const m: metadata = {
    appName: 'WidgetBot',
    title: 'Embed',
    image: Screenshot(
      'https://widgetbot.io/channels/299881420891881473/309009333436547082'
    ),
    type: 'Discord widgets',
    twitter: 'widgetbot_io',
    language: 'en_US',
    keywords: ['widgetbot', 'discord', 'discord widgets', 'voakie', 'samdd'],
    description: 'Embed discord widgets on your website',
    author: 'https://samdd.me, https://voakie.com',
    url: 'https://widgetbot.io',
    copyright: `© WidgetBot ${new Date().getFullYear()}`,
    email: 'support@widgetbot.io',
    ...metadata
  }

  return html`
    <meta name="og:title" content="${`${m.title} » ${m.appName}`}" />
    <title>${`${m.title} » ${m.appName}`}</title>

    <meta name="keywords" content="${m.keywords.join(',')}" />
    <meta name="language" content="${m.language}">
    <meta name="copyright" content="${m.copyright}">

    <meta name="description" content="${m.description}" />
    <meta name="og:description" content="${m.description}" />

    <meta property="og:author" content="${m.author}" />
    <meta name="owner" content="${m.author}">

    <meta name="url" content="${m.url}">
    <meta name="identifier-URL" content="${m.url}">

    <meta name="reply-to" content="${m.email}">
    <meta name="og:email" content="${m.email}"/>

    <meta property="og:title" content="${`${m.title} » ${m.appName}`}"/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="${m.url}"/>
    <meta property="og:site_name" content="${m.appName}"/>
    <meta property="og:locale" content="${m.language}" />
    <meta property="og:image" content="${m.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta name="twitter:site" content="${`@${m.twitter}`}">
    <meta name="twitter:description" content="${m.description}">
    <meta name="twitter:title" content="${`${m.title} » ${m.appName}`}"/>
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:app:name:iphone" content="${m.appName}">
    <meta name="twitter:app:name:ipad" content="${m.appName}">
    <meta name="twitter:app:name:googleplay" content="${m.appName}">
    <meta property="twitter:image:src" content="${m.image}">
  `
    .replace(/>\s+</g, '><')
    .replace('\n', '')
}

export default memoize(generator, {
  normalizer: args => JSON.stringify(args)
})
