import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from 'discord.js'
import { Command } from '../types/command'
import OpenAIBot from '../openaiBot'

// Define your command
export const Imagine: Command = {
  name: 'imagine',
  description: 'Generate an image based on a text prompt.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'text',
      description:
        'The text prompt to generate an image from. Example: "A cat in a hat, digital art."',
      required: true,
    },
  ],
  run: async (
    client: Client,
    interaction: ChatInputCommandInteraction,
    openaiBot: OpenAIBot,
  ) => {
    const text = interaction.options.getString('text') ?? ''
    const imageUrl = await openaiBot.image(text)

    const attchment =
      imageUrl === undefined
        ? { attachment: '', name: 'image.png' }
        : { attachment: imageUrl, name: 'image.png' }

    await interaction.followUp({
      content: `**${text}**\n\n`,
      files: [attchment],
    })
  },
}
