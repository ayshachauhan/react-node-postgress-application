import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChatbotLogsEntity,
  PatientEntity,
  PracticeEntity,
} from '@packages/entities';
import OpenAI from 'openai';
import logger from 'src/logger';
import { Raw, Repository } from 'typeorm';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { PatientsService } from '../patients/patients.service';
import { PracticesService } from '../practices/practices.service';
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
  private threadByUser: { [key: string]: string } = {}; // Store thread IDs by user
  private openaiAssistantId: string;
  private conversationHistory: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[] = [];

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ChatbotLogsEntity)
    private chatbotRepository: Repository<ChatbotLogsEntity>,
    @Inject(forwardRef(() => PatientsService))
    private patientService: PatientsService,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
  ) {
    const { openAiKey, openAiOrg, openAiProjectId } = this.getEnvVariables();
    this.openAI = new OpenAI({
      apiKey: openAiKey,
      organization: openAiOrg,
      project: openAiProjectId,
    });
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
    };
  }

  // Remove citation markers like [1], [2], [3], [4], etc.
  removeCitationMarkers = (text: string): string => {
    return text
      .replace(/\[\d+\]/g, '')
      .trim()
      .replace(/【\d+:\d+†[^】]+】/g, '');
  };

  async doSMSChat(data: {
    phoneNumber: string;
    question: string;
  }): Promise<string> {
    try {
      let chatLogRecords: ChatbotLogsEntity | null =
        await this.getTodayChatLogsByIdentifier(data.phoneNumber);
      if (chatLogRecords) {
        console.log('Chat log record found: ', chatLogRecords.id);
        if (!chatLogRecords.practice || !chatLogRecords.patient) {
          await this.deleteChatLogs(chatLogRecords.id);
          return `Sorry, we didn't know your practice. Please share your practice name with us to serve you better: PRACTICE Practice_Name_Example`;
        }

        const regex = /(?:PRACTICE\s+)?(.*)$/i;
        const match = data.question.match(regex);
        const practice = match ? match[1].trim() : '';
        const practiceRecord: PracticeEntity | null = practice
          ? await this.practiceService.findPracticeByName(practice)
          : null;
        if (practiceRecord) {
          return `${practice} already attached with your reocrds. Kindly ask question.`;
        }
        this.openaiAssistantId = chatLogRecords.assistantId;
      } else {
        const patientRecords: PatientEntity[] | null =
          await this.patientService.getPatientsByPhoneNumber(data.phoneNumber);
        if (patientRecords && patientRecords.length > 0) {
          let practice = '';
          const uniquePractices = Array.from(
            new Set(patientRecords.map((p) => p.practice.name)),
          );

          if (patientRecords.length == 1) {
            practice = patientRecords[0].practice.name;
          } else {
            if (uniquePractices.length === 1) {
              practice = uniquePractices[0]; // Only one unique practice
            } else {
              const regex = /(?:PRACTICE\s+)?(.*)$/i;
              const match = data.question.match(regex);
              practice = match ? match[1].trim() : '';
            }
          }
          this.openaiAssistantId = patientRecords[0].practice?.assistantId;
          const practiceRecord: PracticeEntity | null = practice
            ? await this.practiceService.findPracticeByName(practice)
            : null;
          if (practiceRecord) {
            if (
              (patientRecords.length === 1 &&
                practiceRecord.id != patientRecords[0].practice.id) ||
              (patientRecords.length > 1 &&
                patientRecords.every(
                  (p) => p.practice.id != practiceRecord?.id,
                ))
            ) {
              return `Sorry, ${practice} doesn't belong to you as per records. Kindly check with your doctor OR re-enter practice name as in provided format.`;
            }
            this.openaiAssistantId = practiceRecord?.assistantId;
          } else {
            return `Sorry, we didn't know your practice. Please share your practice name with us to serve you better: PRACTICE Practice_Name_Example`;
          }

          if (patientRecords.length > 1 && !practiceRecord) {
            return `Sorry, we didn't know your practice. Please share your practice name with us to serve you better: PRACTICE Practice_Name_Example`;
          } else if (patientRecords.length === 1) {
            const newChatLog: ChatbotLogsEntity = new ChatbotLogsEntity();
            const dataToSave = {
              ...newChatLog,
              practice: patientRecords[0].practice,
              patient: patientRecords[0],
              userIdentifier: data.phoneNumber,
              assistantId: this.openaiAssistantId,
              botQuestionAnswers: [],
              assistantChatThreadId: '',
            };
            const savedChatLog = await this.saveChatLogs(dataToSave);
            chatLogRecords = { ...savedChatLog };
          } else if (
            patientRecords.length > 1 &&
            uniquePractices.length === 1
          ) {
            const newChatLog: ChatbotLogsEntity = new ChatbotLogsEntity();
            const dataToSave = {
              ...newChatLog,
              practice: patientRecords[0].practice,
              patient: patientRecords[0],
              userIdentifier: data.phoneNumber,
              assistantId: this.openaiAssistantId,
              botQuestionAnswers: [],
              assistantChatThreadId: '',
            };
            const savedChatLog = await this.saveChatLogs(dataToSave);
            chatLogRecords = { ...savedChatLog };
          } else if (
            patientRecords.length > 1 &&
            uniquePractices.length !== 1 &&
            practiceRecord
          ) {
            const newPatients: PatientEntity[] | null =
              await this.patientService.getPatientsByPhoneNumberinPractice(
                data.phoneNumber,
                practiceRecord.id,
              );
            if (newPatients) {
              const newChatLog: ChatbotLogsEntity = new ChatbotLogsEntity();
              const dataToSave = {
                ...newChatLog,
                practice: practiceRecord,
                patient: newPatients[0],
                userIdentifier: data.phoneNumber,
                assistantId: this.openaiAssistantId,
                botQuestionAnswers: [],
                assistantChatThreadId: '',
              };
              const savedChatLog = await this.saveChatLogs(dataToSave);
              chatLogRecords = { ...savedChatLog };
              return `Thank you for sharing your practice ${practiceRecord.name}. Kindly ask question.`;
            }
          }
        } else {
          return `Sorry, your number is not registered with us. Please contact at support@pod111.com for more details.`;
        }
      }

      this.threadByUser[`${data.phoneNumber}`] =
        chatLogRecords?.assistantChatThreadId ?? '';
      // Create a new thread if it's the user's first message
      if (!this.threadByUser[`${data.phoneNumber}`]) {
        try {
          const myThread = await this.openAI.beta.threads.create();
          console.log('New thread created with ID: ', myThread.id, '\n');
          this.threadByUser[`${data.phoneNumber}`] = myThread.id; // Store the thread ID for this user
          if (chatLogRecords) {
            chatLogRecords.assistantId = this.openaiAssistantId;
            chatLogRecords.assistantChatThreadId = myThread.id;
            await this.updateChatLogs({ ...chatLogRecords });
          }
        } catch (error) {
          console.error('Error creating thread:', error);
          return 'Internal server error';
        }
      }
      logger.info('Thread id: ', this.threadByUser[`${data.phoneNumber}`]);
      const myThreadMessage = await this.openAI.beta.threads.messages.create(
        this.threadByUser[`${data.phoneNumber}`], // Use the stored thread ID for this user
        {
          role: 'user',
          content: data?.question,
        },
      );
      logger.info(
        'This is the message object: ',
        JSON.stringify(myThreadMessage),
        '\n',
      );

      // Run the Assistant
      const myRun = await this.openAI.beta.threads.runs.create(
        this.threadByUser[`${data.phoneNumber}`], // Use the stored thread ID for this user
        {
          assistant_id: this.openaiAssistantId,
          instructions: `Assume you are an eye specialist doctor. eye specific files have been attached here. 
             Please analyze those files and store their content at your end. Few questions will be asked to you and you need to reply back from only those documents 
             precisely and accurately. Don't find answers from your global knowledge base. Answer must be restricted to 300 characters only and must be in plain text. 
             If you don't find any accurate context/reply to the question, just reply "I don't know". 
             Please be strict to document search for answering to my questions and answers must be precise and be accurate. 
             Please double check the answer for its accuracy and preciseness. When responding to user queries, 
             avoid including citation markers like [1], [2], [3], or [4] or【4:0†source】in your answers. Focus on providing clear and direct answers 
             without any reference numbers or citation styles. Your responses should be concise and informative, 
             and should not include any formatting or reference markers.`, // Your instructions here
          tools: [{ type: 'file_search' }],
          response_format: { type: 'text' },
        },
      );

      // Periodically retrieve the Run to check on its status
      const retrieveRun = async () => {
        let keepRetrievingRun;

        while (myRun.status !== 'completed') {
          keepRetrievingRun = await this.openAI.beta.threads.runs.retrieve(
            this.threadByUser[`${data.phoneNumber}`], // Use the stored thread ID for this user
            myRun.id,
          );

          logger.info(`Run status: ${JSON.stringify(keepRetrievingRun)}`);

          if (keepRetrievingRun.status === 'completed') {
            console.log('\n');
            break;
          }
          //  To avoid rapid polling
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      };

      // Retrieve the Messages added by the Assistant to the Thread
      const waitForAssistantMessage = async () => {
        await retrieveRun();

        const allMessages = await this.openAI.beta.threads.messages.list(
          this.threadByUser[`${data.phoneNumber}`], // Use the stored thread ID for this user
        );

        // Send the response back to the front end
        const assistantMessage = allMessages.data.find(
          (message) => message.role === 'assistant',
        );
        if (assistantMessage) {
          console.log('Assistant: ', assistantMessage.content);
          return assistantMessage.content.map((content) => {
            if (content.type === 'text') {
              return this.removeCitationMarkers(content.text.value);
            }
            return `I don't know.`;
          }); //.join(' ');
        } else {
          return [];
        }
      };

      const answer = await waitForAssistantMessage();
      if (chatLogRecords) {
        chatLogRecords.botQuestionAnswers.push({
          question: data.question,
          answer: answer[0],
          dateCreated: new Date(),
        });
        await this.updateChatLogs({ ...chatLogRecords });
      }
      return answer[0];
    } catch (error) {
      console.error('Error generating response text:', error);
      throw new Error('Failed to generate text');
    }
  }

  async performChat(data: {
    phoneNumber: string;
    question: string;
  }): Promise<string> {
    this.conversationHistory.push({ role: 'user', content: data?.question });

    const response = await this.openAI.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 300,
      messages: this.conversationHistory,
      temperature: 0.2,
      user: data?.phoneNumber, //  this must be a unique identifier / hashed value of user id or email or username.
    });
    console.log(response);
    const answer = response.choices[0]?.message?.content?.trim() || '';

    // Add assistant's response to conversation history
    this.conversationHistory.push({ role: 'assistant', content: answer });
    return answer;
  }

  //  Gets today's chat summary against a user identifier (phone number/user id)
  async getTodayChatLogsByIdentifier(
    identifier?: string,
  ): Promise<ChatbotLogsEntity | null> {
    return await this.chatbotRepository.findOne({
      where: {
        userIdentifier: identifier,
        dateCreated: Raw((alias) => `DATE(${alias}) = CURRENT_DATE`),
      },
      relations: ['patient', 'practice'],
    });
  }

  async saveChatLogs(
    dataToSave: ChatbotLogsEntity,
  ): Promise<ChatbotLogsEntity> {
    return await this.chatbotRepository.save(dataToSave);
  }

  async updateChatLogs(dataToUpdate: ChatbotLogsEntity): Promise<void> {
    const existingChatRecord = (await this.chatbotRepository.findOne({
      where: { id: dataToUpdate.id },
    })) as ChatbotLogsEntity;

    await this.chatbotRepository.update(existingChatRecord.id, {
      ...dataToUpdate,
      dateUpdated: new Date(),
    });
  }

  async deleteChatLogs(dataIdToDelete: string) {
    await this.chatbotRepository.delete({ id: dataIdToDelete });
  }
}
