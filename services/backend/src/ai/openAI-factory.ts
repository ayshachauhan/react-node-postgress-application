import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotLogsEntity } from '@packages/entities';
import { Repository } from 'typeorm';
import { PatientsService } from '../patients/patients.service';
import { PracticesService } from '../practices/practices.service';
import { AIFactory } from './ai-factory.interface';
import { OpenAIService } from './openAI.service';

@Injectable()
export class OpenAIFactory implements AIFactory {
  /**
   *  Factor class constructor
   */
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ChatbotLogsEntity)
    private chatbotRepository: Repository<ChatbotLogsEntity>,
    @Inject(forwardRef(() => PatientsService))
    private patientService: PatientsService,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
  ) {}
  createAIService(): OpenAIService {
    return new OpenAIService(
      this.configService,
      this.chatbotRepository,
      this.patientService,
      this.practiceService,
    );
  }
}
