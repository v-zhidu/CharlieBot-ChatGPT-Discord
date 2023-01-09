import {
  ChatInputCommandInteraction,
  ChatInputApplicationCommandData,
  Client,
} from 'discord.js'
import OpenAIBot from '../openaiBot'

export interface Command extends ChatInputApplicationCommandData {
  run: (
    client: Client,
    interaction: ChatInputCommandInteraction,
    openaiBot: OpenAIBot,
  ) => void
}
