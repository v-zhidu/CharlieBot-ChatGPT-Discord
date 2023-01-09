import { Client, Events, ChannelType, Message } from 'discord.js'
import OpenAIBot from '../openaiBot'

export default (client: Client, openaiBot: OpenAIBot): void => {
  client.on(Events.MessageCreate, async (message: any) => {
    if (message.author.bot) {
      return
    }

    const needReply: boolean =
      message.channel.type == ChannelType.DM ||
      message.channel.type == ChannelType.GroupDM ||
      message.mentions.has(client.user)

    if (needReply) {
      if (!message.content || message.content.length === 0) {
        message.reply({ content: 'How can I help you?' })
        return
      }

      let cleanContent: string = message.content
      if (
        message.channel.type != ChannelType.DM &&
        message.mentions.has(client.user)
      ) {
        cleanContent = message.content.split(' ').slice(1).join(' ')
      }

      if (message.reference) {
        const ref = await message.fetchReference()
        cleanContent = `${ref.content} ${cleanContent}`
      }

      console.debug(
        `Received message from ${message.author.tag}: ${cleanContent}`,
      )
      const reply = await openaiBot.chat(message.channel.id, cleanContent)
      message.reply({ content: reply })
    }
  })
}
