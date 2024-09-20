import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotLogsEntity } from '@packages/entities';
import { Brackets, Repository } from 'typeorm';
import { AIService } from './ai-service.interface';
import { CustomGPTFactory } from './customGPT-factory';
import { OpenAIFactory } from './openAI-factory';
import { GetChatParams } from './types';
// import { ChatbotLogsEntity } from '@packages/entities/*';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';

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
            "EXISTS (SELECT 1 FROM jsonb_array_elements(chatbotlogs.botQuestionAnswers) elem WHERE elem->>'answer' = :answer)",
            { answer },
          );
        }),
      );
    }

    const response = await queryBuilder.getMany();

    return response;
  }
}
