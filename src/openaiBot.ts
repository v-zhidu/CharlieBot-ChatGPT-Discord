import {Configuration, CreateChatCompletionRequest, OpenAIApi} from 'openai'
import {ChatCompletionRequestMessage} from "openai/api";

let chat_history: Array<ChatCompletionRequestMessage> = []
chat_history.push({
    role: 'system',
    content: 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, funny and very friendly. Return raw markdown text.'
})

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

        const request: CreateChatCompletionRequest = {
            // this model field is required
            model: 'gpt-3.5-turbo',
            // add your ChatGPT model parameters below
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            messages: [
                {
                    role: 'system',
                    content: 'I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown", return raw markdown text'
                },
                {role: 'user', content: promot}
            ],
        }
        return await this.completion(request)
    }

    async translate(promot: string, to: string): Promise<string | undefined> {
        if (isNullOrEmpty(promot)) {
            return 'Please enter a question.'
        }

        const request: CreateChatCompletionRequest = {
            // this model field is required
            model: 'gpt-3.5-turbo',
            // add your ChatGPT model parameters below
            temperature: 0.3,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            messages: [
                {
                    role: 'system',
                    content: `Translate this into ${to}`
                },
                {role: 'user', content: promot}
            ],
        }
        return await this.completion(request)
    }

    async correct(text: string): Promise<string | undefined> {
        if (isNullOrEmpty(text)) {
            return 'Please enter a sentence.'
        }

        const request: CreateChatCompletionRequest = {
            // this model field is required
            model: 'gpt-3.5-turbo',
            // add your ChatGPT model parameters below
            temperature: 0.3,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
            messages: [
                {
                    role: 'system',
                    content: "Correct this to more standard and authentic. If it is correct, reply correct"
                },
                {role: 'user', content: text}
            ],
        }

        return await this.completion(request)
    }

    async chat(userId: string, promot: string): Promise<string | undefined> {
        if (isNullOrEmpty(promot)) {
            return 'How can I help you?'
        }

        chat_history.push({role: 'user', content: promot, name: userId})
        const request: CreateChatCompletionRequest = {
            // this model field is required
            model: 'gpt-3.5-turbo',
            // add your ChatGPT model parameters below
            temperature: 0.9,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            messages: chat_history
        }

        const reply = await this.completion(request)
        if (reply) {
            chat_history.push({role: 'assistant', content: reply})
        }

        return reply
    }

    async completion(
        createChatCompletionRequest: CreateChatCompletionRequest,
    ): Promise<string | undefined> {
        try {
            const response = await this.openai.createChatCompletion(
                createChatCompletionRequest,
            )
            // use OpenAI API to get ChatGPT reply message
            return response?.data?.choices[0]?.message?.content.trim()
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
