import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ChatbotLogsEntity } from '@packages/entities/ChatbotLogsEntity';
// import { Repository } from 'typeorm';
// import { PatientsService } from '../patients/patients.service';
import OpenAI from 'openai';
import { ENVIRONMENT_VARIABLES } from 'src/enums/environment.enums';
import { AIService } from './ai-service.interface';

export type Role = 'system' | 'user' | 'assistant';
// types/openai.types.ts
export type ChatCompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

@Injectable()
export class OpenAIService implements AIService {
  private openAI: OpenAI;
  private threadByUser = {}; // Store thread IDs by user
  private readonly openaiAssistantId: string;
  // private conversationHistory:ChatCompletionMessage[] = [
  //     { role: 'system', content: `Assume you are an eye specialist doctor. eye specific files have been attached here.
  //         Please analyze those files and store their content at your end. Few questions will be asked to you and you need to reply back from those documents
  //         precisely and accurately. Answer must be restricted to 300 characters only and must be in plain text.
  //         If you don't find any accurate context/reply to the question, just reply "I don't know".
  //         Please be strict to document search for answering to my questions and answers must be precise and be accurate.
  //         Please double check the answer for its accuracy and preciseness.` },
  // ];
  //private conversationHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];

  constructor(
    //     @InjectRepository(ChatbotLogsEntity)
    //     private chatbotRepository: Repository<ChatbotLogsEntity>,
    //     @Inject(forwardRef(() => PatientsService))
    //     private patientService: PatientsService,
    private readonly configService: ConfigService,
  ) {
    const { openAiKey, openAiOrg, openAiProjectId, assistantId } =
      this.getEnvVariables();
    this.openAI = new OpenAI({
      apiKey: openAiKey,
      organization: openAiOrg,
      project: openAiProjectId,
    });
    this.openaiAssistantId = assistantId;
  }

  getEnvVariables(): Record<string, string | ''> {
    return {
      openAiKey:
        this.configService.get<string>(ENVIRONMENT_VARIABLES.OPENAI_API_KEY) ??
        '',
      openAiOrg:
        this.configService.get<string>(
          ENVIRONMENT_VARIABLES.OPENAI_ORGANISATION,
        ) ?? '',
      openAiProjectId:
        this.configService.get<string>(ENVIRONMENT_VARIABLES.OPENAI_PROJECT) ??
        '',
      assistantId:
        this.configService.get<string>(
          ENVIRONMENT_VARIABLES.OPENAI_ASSISTANT_ID,
        ) ?? '',
    };
  }

  //   async initializeConversation(): Promise<void> {
  //     // Add system messages or instructions relevant to the documents
  //     this.conversationHistory = [
  //       { role: 'system', content: `Assume you are an eye specialist doctor. eye specific files have been attached here.
  //              Please analyze those files and store their content at your end. Few questions will be asked to you and you need to reply back from those documents
  //              precisely and accurately. Answer must be restricted to 300 characters only and must be in plain text.
  //              If you don't find any accurate context/reply to the question, just reply "I don't know".
  //              Please be strict to document search for answering to my questions and answers must be precise and be accurate.
  //              Please double check the answer for its accuracy and preciseness.` },
  //     ];
  //   }

  async doSMSChat(data: any): Promise<any> {
    try {
      // Create a new thread if it's the user's first message
      if (!this.threadByUser[data?.phoneNumber]) {
        try {
          const myThread = await this.openAI.beta.threads.create();
          console.log('New thread created with ID: ', myThread.id, '\n');
          this.threadByUser[data?.phoneNumber] = myThread.id; // Store the thread ID for this user
        } catch (error) {
          console.error('Error creating thread:', error);
          return 'Internal server error';
        }
      }

      const myThreadMessage = await this.openAI.beta.threads.messages.create(
        this.threadByUser[data?.phoneNumber], // Use the stored thread ID for this user
        {
          role: 'user',
          content: data?.question,
        },
      );
      console.log('This is the message object: ', myThreadMessage, '\n');

      // Run the Assistant
      const myRun = await this.openAI.beta.threads.runs.create(
        this.threadByUser[data?.phoneNumber], // Use the stored thread ID for this user
        {
          assistant_id: this.openaiAssistantId,
          instructions: `Assume you are an eye specialist doctor. eye specific files have been attached here. 
             Please analyze those files and store their content at your end. Few questions will be asked to you and you need to reply back from those documents 
             precisely and accurately. Answer must be restricted to 300 characters only and must be in plain text. 
             If you don't find any accurate context/reply to the question, just reply "I don't know". 
             Please be strict to document search for answering to my questions and answers must be precise and be accurate. 
             Please double check the answer for its accuracy and preciseness.`, // Your instructions here
          tools: [{ type: 'file_search' }],
        },
      );
      console.log('This is the run object: ', myRun, '\n');

      // Periodically retrieve the Run to check on its status
      const retrieveRun = async () => {
        let keepRetrievingRun;

        while (myRun.status !== 'completed') {
          keepRetrievingRun = await this.openAI.beta.threads.runs.retrieve(
            this.threadByUser[data?.phoneNumber], // Use the stored thread ID for this user
            myRun.id,
          );

          console.log(`Run status: ${keepRetrievingRun.status}`);

          if (keepRetrievingRun.status === 'completed') {
            console.log('\n');
            break;
          }
        }
      };
      retrieveRun();

      // Retrieve the Messages added by the Assistant to the Thread
      const waitForAssistantMessage = async () => {
        await retrieveRun();

        const allMessages = await this.openAI.beta.threads.messages.list(
          this.threadByUser[data?.phoneNumber], // Use the stored thread ID for this user
        );

        // Send the response back to the front end
        const assistantMessage = allMessages.data.find(
          (message) => message.role === 'assistant',
        );
        if (assistantMessage) {
          console.log('Assistant: ', assistantMessage.content);
          return assistantMessage.content;
        } else {
          return 'No response from the assistant';
        }
      };
      await waitForAssistantMessage();

      // this.conversationHistory.push({ role: 'user', content: data?.question });

      // const response = await this.openAI.chat.completions.create({
      //   model: 'gpt-4o',
      // //   prompt: `Assume you are an eye specialist doctor. Eye treatment specific files have been attached in the project.
      // //     Few questions will be asked to you and you need to reply back from those documents precisely and accurately.
      // //     Answer must be restricted to 300 characters only and must be in plain text. If you don't find any accurate context/reply to the question,
      // //     just reply "I don't know". Please be strict to document search for answering to my questions and answers must be precise and be accurate.
      // //     Please double check the answer for its accuracy and preciseness. Question is: ${data?.question}` ?? 'How are you ?',
      //   max_tokens: 300,
      //   messages: this.conversationHistory,
      //   temperature: 0.2,
      //   user: data?.phoneNumber,  //  this must be a unique identifier / hashed value of user id or email or username.
      // });
      // console.log(response);
      // const answer = response.choices[0]?.message?.content?.trim() || '';

      // // Add assistant's response to conversation history
      // this.conversationHistory.push({ role: 'assistant', content: answer });
      //return answer;
    } catch (error) {
      console.error('Error generating text:', error);
      throw new Error('Failed to generate text');
    }
  }
}
