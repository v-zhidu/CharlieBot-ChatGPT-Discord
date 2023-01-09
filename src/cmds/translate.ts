import {
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} from 'discord.js'
import { Command } from '../types/command'
import OpenAIBot from '../openaiBot'

// Define your command
export const Translate: Command = {
  name: 'translate',
  description: 'Translates input text into other languages.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'lang',
      description: 'The Top 10 language to translate to.',
      required: true,
      choices: [
        {
          name: 'English',
          value: 'English',
        },
        {
          name: 'Spanish',
          value: 'Spanish',
        },
        {
          name: 'Chinese',
          value: 'Chinese',
        },
        {
          name: 'Hindi',
          value: 'Hindi',
        },
        {
          name: 'Arabic',
          value: 'Arabic',
        },
        {
          name: 'French',
          value: 'French',
        },
        {
          name: 'Bengali',
          value: 'Bengali',
        },
        {
          name: 'Russian',
          value: 'Russian',
        },
        {
          name: 'Portuguese',
          value: 'Portuguese',
        },
        {
          name: 'Japanese',
          value: 'Japanese',
        },
      ],
    },
    {
      type: ApplicationCommandOptionType.String,
      name: 'text',
      description: 'The text to translate.',
      required: true,
    },
  ],
  run: async (
    client: Client,
    interaction: ChatInputCommandInteraction,
    openaiBot: OpenAIBot,
  ) => {
    const lang = interaction.options.getString('lang') ?? 'English'
    const text = interaction.options.getString('text') ?? ''
    const reply = await openaiBot.translate(text, lang)

    const formatedReply = `> **Transalate into ${lang}**:\n> ${text}\n\n *${reply}*`

    await interaction.followUp({
      content: formatedReply,
    })
  },
}
