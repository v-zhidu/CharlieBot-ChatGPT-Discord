import { Client, Events, ChatInputCommandInteraction } from 'discord.js'
import { Commands } from '../commands'
import { Command } from '../types/command'
import OpenAIBot from '../openaiBot'

export default (client: Client, openaiBot: OpenAIBot): void => {
  client.on(Events.InteractionCreate, async (interaction: any) => {
    if (interaction.isCommand()) {
      await handleSlashCommand(client, interaction, openaiBot)
    }
  })
}

const handleSlashCommand = async (
  client: Client,
  interaction: ChatInputCommandInteraction,
  openaiBot: OpenAIBot,
): Promise<void> => {
  const slashCommand = Commands.find(
    (c: Command) => c.name === interaction.commandName,
  )
  if (!slashCommand) {
    interaction.followUp({ content: 'An error has occurred' })
    return
  }

  await interaction.deferReply({ ephemeral: false })
  slashCommand.run(client, interaction, openaiBot)
}
