import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from 'discord.js'
import { Command } from '../types/command'
import OpenAIBot from '../openaiBot'

// Define your command
export const Answers: Command = {
  name: 'answers',
  description: 'Answer questions based on existing knowledge.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'question',
      description:
        'The question to answer. Example: "What is the meaning of life?"',
      required: true,
    },
  ],
  run: async (
    client: Client,
    interaction: ChatInputCommandInteraction,
    openaiBot: OpenAIBot,
  ) => {
    await interaction.deferReply()
    const question = interaction.options.getString('question') ?? ''
    const reply = await openaiBot.qa(question)
    await interaction.deleteReply()

    const formatedReply = `**Q: ${question}** - <@${interaction.user.id}>\n\n*${reply}*`
    await interaction.channel?.send({
      content: formatedReply,
    })
  },
}
