import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { InjectRepository } from '@nestjs/typeorm';
// import { ChatbotLogsEntity } from '@packages/entities/ChatbotLogsEntity';
// import { Repository } from 'typeorm';
// import { PatientsService } from '../patients/patients.service';
import OpenAI from 'openai';
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';
import { AIService } from './ai-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotLogsEntity, PracticeEntity } from '@packages/entities';
import { Raw, Repository } from 'typeorm';
import { PatientsService } from '../patients/patients.service';
import { PracticesService } from '../practices/practices.service';

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
  private readonly openaiAssistantId: string;
  private conversationHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ChatbotLogsEntity)
    private chatbotRepository: Repository<ChatbotLogsEntity>,
    @Inject(forwardRef(() => PatientsService))
    private patientService: PatientsService,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
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

  // Remove citation markers like [1], [2], [3], [4], etc.
  removeCitationMarkers = (text: string): string => {    
    return text.replace(/\[\d+\]/g, '').trim().replace(/【\d+:\d+†[^】]+】/g, '');
  };

  async doSMSChat(data: { phoneNumber: string; question: string }): Promise<any> {
    try {
      //const input = "MRN: 1234abcd5678, Practice: 9876xyz54321";
      const regex = /MRN\s*([A-Za-z0-9]{10,16}),\s*Practice\s*([A-Za-z0-9]{10,16})/;
      const match = data.question.match(regex);
      let MRN; 
      let practice;
      let patientRecord;
      if (match) {
        MRN = match[1];
        practice = match[2];
        console.log(`MRN: ${MRN}, Practice: ${practice}`);
        const practiceRecord: PracticeEntity | null = await this.practiceService.findPractice(practice);
        if (practiceRecord) {
          patientRecord = await this.patientService.getPatientsByMrn(practiceRecord.id, MRN);
        }
      }

      const chatLogRecords: any = await this.getTodayChatLogsByIdentifier(data.phoneNumber);
      let updateRecord: ChatbotLogsEntity;
      console.log('record: ', chatLogRecords);
      if (chatLogRecords && chatLogRecords.assistantId === this.openaiAssistantId) {
        updateRecord = { ...chatLogRecords };
        if (chatLogRecords && chatLogRecords.botQuestionAnswers.length > 0) {
          const count = chatLogRecords.botQuestionAnswers.length + 1;
          if (count >= 3 && !chatLogRecords.patient) {
            return [`Sorry, you didn't provide the required details. Please contact to your practice doctor.`];
          } else {
            //  TODO: Need to put some condition to send back this message.
          }
        }        
        if (patientRecord && !chatLogRecords.patient)
        {
          updateRecord.patient = patientRecord;
        }
        await this.updateChatLogs({ ...updateRecord, botQuestionAnswers: data.question });
      } else {
        //  No records found, then save a new record.
        const dataToSave: Partial<ChatbotLogsEntity> = {
          userIdentifier: data.phoneNumber,
          assistantId: this.openaiAssistantId,
          botQuestionAnswers: [{ question: data.question, answer: '' }],
          assistantChatThreadId: '',
          patient: null,
          id: '',
        };
        await this.saveChatLogs(dataToSave);
        return [`Sorry, we didn't know your practice. Please share your practice details & MRN in following format to serve your better: MRN xxxx, Practice 123xxx789`];
      }

      this.threadByUser[`${data.phoneNumber}`] = updateRecord.assistantChatThreadId ?? null;
      console.log('Thread id: ', this.threadByUser[`${data.phoneNumber}`], '  phone; ', data?.phoneNumber);
      // Create a new thread if it's the user's first message
      if (!this.threadByUser[`${data.phoneNumber}`]) {
        try {
          const myThread = await this.openAI.beta.threads.create();
          console.log('New thread created with ID: ', myThread.id, '\n');
          this.threadByUser[`${data.phoneNumber}`] = myThread.id; // Store the thread ID for this user
        } catch (error) {
          console.error('Error creating thread:', error);
          return 'Internal server error';
        }
      }

      const myThreadMessage = await this.openAI.beta.threads.messages.create(
        this.threadByUser[`${data.phoneNumber}`], // Use the stored thread ID for this user
        {
          role: 'user',
          content: data?.question,
        },
      );
      console.log('This is the message object: ', myThreadMessage, '\n');

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
          response_format: { type: "text" },
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

          console.log(`Run status: ${keepRetrievingRun.status}`);

          if (keepRetrievingRun.status === 'completed') {
            console.log('\n');
            break;
          }
          //  To avoid rapid polling
          await new Promise(resolve => setTimeout(resolve, 2000));
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
          return assistantMessage.content.map(content => {
            if (content.type === 'text') {
              return this.removeCitationMarkers(content.text.value);
            }
            return `I don't know.`;
          });//.join(' ');
        } else {
          return [];
        }
      };

      const answer = await waitForAssistantMessage();
      updateRecord.assistantId = this.openaiAssistantId;
      updateRecord.assistantChatThreadId = updateRecord.assistantChatThreadId ?? this.threadByUser[`${data.phoneNumber}`];
      await this.updateChatLogs({ ...chatLogRecords });
      return answer;
    } catch (error) {
      console.error('Error generating response text:', error);
      throw new Error('Failed to generate text');
    }
  }

  async performChat(data: any): Promise<any> { 
    this.conversationHistory.push({ role: 'user', content: data?.question });

      const response = await this.openAI.chat.completions.create({
        model: 'gpt-4o',
        max_tokens: 300,
        messages: this.conversationHistory,
        temperature: 0.2,
        user: data?.phoneNumber,  //  this must be a unique identifier / hashed value of user id or email or username.
      });
      console.log(response);
      const answer = response.choices[0]?.message?.content?.trim() || '';

      // Add assistant's response to conversation history
      this.conversationHistory.push({ role: 'assistant', content: answer });
      return answer;
  }

  //  Gets today's chat summary against a user identifier (phone number/user id)
  async getTodayChatLogsByIdentifier(identifier?: string): Promise<any> {
    return await this.chatbotRepository.find({
      where: {
        userIdentifier: identifier, 
        dateCreated: Raw(
          (alias) => `DATE(${alias}) = CURRENT_DATE`
        ),
      },
      relations: ['patient'],
    });
  }

  async saveChatLogs(dataToSave: ChatbotLogsEntity): Promise<any> {    
    const resp = await this.chatbotRepository.create(dataToSave);
    console.log(resp);
  }

  async updateChatLogs(dataToUpdate: any): Promise<any> {
    const existingChatRecord = (await this.chatbotRepository.findOne({
      where: { id: dataToUpdate.id },
    })) as ChatbotLogsEntity;

    return await this.chatbotRepository.update(existingChatRecord.id, { ...dataToUpdate, dateUpdated: Date.now() });
  }
}
