import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotLogsEntity, EmailLogEntity } from '@packages/entities';
import { Brackets, Repository } from 'typeorm';
import { AIService } from './ai-service.interface';
import { CustomGPTFactory } from './customGPT-factory';
import { OpenAIFactory } from './openAI-factory';
import { GetChatParams, GetMessageParams } from './types';
// import { ChatbotLogsEntity } from '@packages/entities/*';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

type LogEntity =
  | (ChatbotLogsEntity & { type: 'chatbot' })
  | (EmailLogEntity & { type: 'sms' });

@Injectable()
export class AIClientService {
  private aiService: AIService;

  constructor(
    @Inject(OpenAIFactory)
    private readonly openAIFactory: OpenAIFactory,
    @Inject(CustomGPTFactory)
    private readonly customGPTFactory: CustomGPTFactory,
    @InjectRepository(ChatbotLogsEntity)
    private chatbotRepository: Repository<ChatbotLogsEntity>,
    @InjectRepository(EmailLogEntity)
    private messageRepository: Repository<EmailLogEntity>,
  ) {}

  selectAIService(type: 'openai' | 'customgpt'): void {
    if (type === 'openai') {
      this.aiService = this.openAIFactory.createAIService();
    } else if (type === 'customgpt') {
      this.aiService = this.customGPTFactory.createAIService();
    } else {
      throw new Error('Invalid AI Service type');
    }
  }

  async smsChat(
    type: 'openai' | 'customgpt',
    data: { phoneNumber: string; question: string },
  ): Promise<string> {
    this.selectAIService(type);
    if (!this.aiService) {
      throw new Error('AI Service not selected');
    }
    return await this.aiService.doSMSChat(data);
  }

  /**
   * Get all chat history for a specific practice
   * @param param0
   * @returns ChatbotLogsEntity[]
   */
  async getAllChatLogs({
    practiceId,
    patientId,
    mrn,
    answer,
  }: GetChatParams): Promise<ChatbotLogsEntity[]> {
    const queryBuilder = this.chatbotRepository
      .createQueryBuilder('chatbotlogs')
      .where('chatbotlogs.practiceId = :practiceId', { practiceId });
    if (patientId) {
      queryBuilder.andWhere('chatbotlogs.patientId = :patientId', {
        patientId,
      });
    }
    queryBuilder
      .leftJoinAndSelect('chatbotlogs.patient', 'patient')
      .orderBy('chatbotlogs.dateCreated', 'DESC');

    if (mrn) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('patient.mrn = :mrn', { mrn });
        }),
      );
    }
    if (answer) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(
            `EXISTS (
              SELECT 1 FROM jsonb_array_elements(chatbotlogs.botQuestionAnswers) elem 
              WHERE elem->>'answer' ILIKE :answer
            )`,
            { answer: `%${answer}%` },
          );
        }),
      );
    }

    const response = await queryBuilder.getMany();

    return response;
  }

  /**
   * Get all chat history for a specific practice
   * @param param0
   * @returns ChatbotLogsEntity[]
   */
  async getAllLogs({
    practiceId,
    patientId,
    mrn,
    email,
  }: GetMessageParams): Promise<LogEntity[]> {
    const chatbotQueryBuilder = this.chatbotRepository
      .createQueryBuilder('chatbotlogs')
      .where('chatbotlogs.practiceId = :practiceId', { practiceId });

    if (patientId) {
      chatbotQueryBuilder.andWhere('chatbotlogs.patientId = :patientId', {
        patientId,
      });
    }

    chatbotQueryBuilder
      .leftJoinAndSelect('chatbotlogs.patient', 'patient')
      .orderBy('chatbotlogs.dateCreated', 'DESC');

    if (mrn) {
      chatbotQueryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('patient.mrn = :mrn', { mrn });
        }),
      );
    }

    // Fetch data from the email_logs table
    const emailLogsQueryBuilder = this.messageRepository
      .createQueryBuilder('email_logs')
      .where('email_logs.data::jsonb @> :emailCondition', {
        emailCondition: JSON.stringify({ to: email }),
      })
      .andWhere(
        "email_logs.data::jsonb ->> 'text' IS NOT NULL AND trim(email_logs.data::jsonb ->> 'text') != ''",
      );

    const [chatbotLogs, emailLogs] = await Promise.all([
      chatbotQueryBuilder.getMany(),
      emailLogsQueryBuilder.getMany(),
    ]);

    // Combine the results
    const combinedLogs: LogEntity[] = [
      ...chatbotLogs.map((log) => ({
        type: 'chatbot' as const, // Explicitly cast the type
        ...log,
      })),
      ...emailLogs.map((log) => ({
        type: 'sms' as const, // Explicitly cast the type
        ...log,
      })),
    ];

    return combinedLogs.sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );
  }
}
