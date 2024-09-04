import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AIFactory } from './ai-factory.interface';
import { OpenAIService } from './openAI.service';

@Injectable()
export class OpenAIFactory implements AIFactory {
  /**
   *  Factor class constructor
   */
  constructor(private readonly configService: ConfigService) {}
  createAIService(): OpenAIService {
    return new OpenAIService(this.configService);
  }
}
