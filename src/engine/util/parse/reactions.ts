import * as Discord from 'discord.js'
import { Reaction } from '../../../types/message'

async function Reactions(
  msgReactions: Discord.MessageReaction[]
): Promise<Reaction[]> {
  const reactions = msgReactions.map((reaction): Reaction => ({
    name: reaction.emoji.name,
    id: reaction.emoji.id,
    count: reaction.count
  }))

  return reactions.length ? reactions : null
}

export default Reactions
