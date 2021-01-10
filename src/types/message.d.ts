import { TextChannel, PermissionObject } from 'discord.js'

export interface Channel {
  name: string
  topic: string
  id: string
  category: string
  permissions: PermissionObject
}

interface Message {
  id: string
  author: Author
  timestamp: number
  content: string | null
  embeds: Embed[]
  editedAt: number
  type: string
  reactions: Reaction[]
  attachment: Attachment
  mentions: {
    channels: {
      name: string
      id: string
    }[]
    members: {
      name: string
      id: string
      roles: Role[] | null
      avatar: string
    }[]
    roles: {
      name: string
      color: string
      id: string
    }[]
    everyone: boolean
  }
}

export interface Author {
  name: string
  type: 'bot' | 'sysadmin' | 'guest' | 'member'
  avatar: string | null
  id: string
  color: string
  roles: Role[] | null
}

export interface Role {
  color: string
  position: number
  name: string
}

export interface Embed {
  color?: number
  fields?: EmbedField[]
  footer?: EmbedFooter
  thumbnail?: EmbedThumbnail
  author: Author
  image?: EmbedImage
  provider?: EmbedProvider
  video?: EmbedVideo
  title?: string
  type: string
  description?: string
  url?: string
  timestamp?: number
}

export interface EmbedField {
  value?: string
  name?: string
  inline?: Boolean
}

export interface EmbedFooter {
  iconURL?: string
  proxyIconUrl?: string
  text?: string
}

export interface EmbedThumbnail {
  height?: number
  width?: number
  proxyURL?: string
  url?: string
}

export interface EmbedImage {
  height?: number
  width?: number
  proxyURL?: string
  url?: string
}

export interface EmbedProvider {
  name?: string
  url?: string
}

export interface EmbedVideo {
  height?: number
  width?: number
  url?: string
}

export interface Reaction {
  id: string
  name: string
  count: number
}

export interface Attachment {
  url: string
  height: number
  width: number
}

export default Message
export type messages = Message[]
