import { Client, Events } from 'discord.js'
import { Commands } from '../commands'

export default (client: Client): void => {
  client.on(Events.ClientReady, async () => {
    console.log('Ready!')
    await client.application?.commands.set(Commands)
  })
}
