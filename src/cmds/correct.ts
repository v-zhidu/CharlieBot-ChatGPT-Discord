import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from 'discord.js'
import { Command } from '../types/command'
import OpenAIBot from '../openaiBot'

// Define your command
export const Correct: Command = {
  name: 'correct',
  description: 'Corrects sentences into standard English.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'text',
      description: 'The text to correct. Example: "She no went to the market.',
      required: true,
    },
  ],
  run: async (
    client: Client,
    interaction: ChatInputCommandInteraction,
    openaiBot: OpenAIBot,
  ) => {
    await interaction.deferReply()
    const text = interaction.options.getString('text') ?? ''
    const reply = await openaiBot.correct(text)
    await interaction.deleteReply()

    const formatedReply = `**Correct this sentence: ${text}** - <@${interaction.user.id}>\n\n*${reply}*`
    await interaction.channel?.send({
      content: formatedReply,
    })
  },
}
