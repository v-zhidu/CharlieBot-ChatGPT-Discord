import * as dotenv from 'dotenv'
import * as Discord from 'discord.js'
import { Configuration } from 'openai'
import OpenAIBot from './openaiBot'
import ready from './listeners/ready'
import messageCreate from './listeners/messageCreate'
import interactionCreate from './listeners/interactionCreate'

dotenv.config()

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.DirectMessages,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
  partials: [Discord.Partials.Message, Discord.Partials.Channel],
})

const bot = new OpenAIBot({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
})

ready(client)
messageCreate(client, bot)
interactionCreate(client, bot)

client.login(process.env.DISCORD_TOKEN)
