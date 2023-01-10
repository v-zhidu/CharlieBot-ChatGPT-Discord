import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai'
import Keyv from 'keyv'

const keyvContext = new Keyv('sqlite://data/db_context.sqlite')

class OpenAIBot {
  openai: OpenAIApi

  constructor(config: any) {
    this.openai = new OpenAIApi(
      new Configuration({
        organization: config.organization,
        apiKey: config.apiKey,
      }),
    )
    console.log('OpenAI Bot launched!')
  }

  async qa(promot: string): Promise<string | undefined> {
    if (isNullOrEmpty(promot)) {
      return 'Please enter a question.'
    }

    const request: CreateCompletionRequest = {
      // this model field is required
      model: 'text-davinci-003',
      // add your ChatGPT model parameters below
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['\n'],
      prompt: `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown", return raw markdown text.\n\nQ: ${promot}\nA:`,
    }
    return await this.completion(request)
  }

  async translate(promot: string, to: string): Promise<string | undefined> {
    if (isNullOrEmpty(promot)) {
      return 'Please enter a question.'
    }

    const request: CreateCompletionRequest = {
      // this model field is required
      model: 'text-davinci-003',
      // add your ChatGPT model parameters below
      temperature: 0.3,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      prompt: `Translate this into ${to}:\n\n${promot}\n\n`,
    }
    return await this.completion(request)
  }

  async correct(text: string): Promise<string | undefined> {
    if (isNullOrEmpty(text)) {
      return 'Please enter a sentence.'
    }

    const request: CreateCompletionRequest = {
      // this model field is required
      model: 'text-davinci-003',
      // add your ChatGPT model parameters below
      temperature: 0.3,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      prompt: `Correct this to more standard and authentic. If it is correct, reply correct:\n\n${text}\n\n`,
    }

    return await this.completion(request)
  }

  async chat(sessionId: string, promot: string): Promise<string | undefined> {
    if (isNullOrEmpty(promot)) {
      return 'How can I help you?'
    }

    let context: string = await keyvContext.get(sessionId)
    if (isNullOrEmpty(context)) {
      context = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, funny and very friendly. Return raw markdown text.\n\nYou: Hello, who are you?\nBot: I am an AI robot named Charlie. How can I help you today?\nYou: ${promot}\nBot: `
    } else {
      context = `${context}\nYou: ${promot}\nBot: `
    }

    const request: CreateCompletionRequest = {
      // this model field is required
      model: 'text-davinci-003',
      // add your ChatGPT model parameters below
      temperature: 0.9,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      prompt: context,
      stop: ['Bot:', 'You:'],
    }

    const reply = await this.completion(request)
    await keyvContext.set(sessionId, `${context}${reply}`)
    return reply
  }

  async completion(
    createCompletionRequest: CreateCompletionRequest,
  ): Promise<string | undefined> {
    try {
      const response = await this.openai.createCompletion(
        createCompletionRequest,
      )
      // use OpenAI API to get ChatGPT reply message
      // console.debug('ChatGPT ask:', createCompletionRequest.prompt)
      const chatgptReplyMessage = response?.data?.choices[0]?.text?.trim()
      // console.debug('ChatGPT says:', chatgptReplyMessage)
      return chatgptReplyMessage
    } catch (e) {
      console.error(e)
      return "Sorry, I'm having trouble talking to Server."
    }
  }

  async image(prompt: string): Promise<string | undefined> {
    try {
      const response = await this.openai.createImage({
        prompt: prompt,
        n: 1,
        size: '512x512',
      })
      return response.data.data[0].url
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}

function isNullOrEmpty(str: string | null | undefined): boolean {
  return !str || str.length === 0
}

export default OpenAIBot
