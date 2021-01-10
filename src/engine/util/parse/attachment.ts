import * as Discord from 'discord.js'
import { Reaction, Attachment } from '../../../types/message'

async function Attachment(
  attachments: Discord.MessageAttachment[]
): Promise<Attachment> {
  const [attachment] = attachments

  return attachment
    ? {
        width: attachment.width,
        height: attachment.height,
        url: attachment.url
      }
    : null
}

export default Attachment
