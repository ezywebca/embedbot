import * as Discord from 'discord.js'

import * as Message from '../../../types/message'

class Embed implements Message.Embed {
  type
  fields
  footer
  thumbnail
  author
  image
  provider
  video
  embed
  message

  constructor(embed: Discord.MessageEmbed) {
    if (!embed) return

    Object.assign(this, embed)

    this.fields = this.arrayFilter(this.fields)
    this.footer = this.objectFilter(this.footer)
    this.thumbnail = this.objectFilter(this.thumbnail)
    this.author = this.objectFilter(this.author)
    this.image = this.objectFilter(this.image)
    this.provider = this.objectFilter(this.provider)
    this.video = this.objectFilter(this.video)

    delete this.embed
    delete this.message
  }

  objectFilter(item: {}) {
    if (!item) return item
    delete (item as { embed: string }).embed
    return item
  }

  arrayFilter(array: {}[]) {
    if (!array) return array
    return array.map(item => this.objectFilter(item))
  }
}

export default Embed
