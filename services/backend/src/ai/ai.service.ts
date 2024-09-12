import { Inject, Injectable } from '@nestjs/common';
import { AIService } from './ai-service.interface';
import { CustomGPTFactory } from './customGPT-factory';
import { OpenAIFactory } from './openAI-factory';
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
    // @InjectRepository(ChatbotLogsEntity)
    // private chatbotRepository: Repository<ChatbotLogsEntity>,
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
    return this.aiService.doSMSChat(data);
  }
}
