import { Injectable } from '@nestjs/common';
import { AIFactory } from './ai-factory.interface';
import { CustomGPTService } from './customGPT.service';

@Injectable()
export class CustomGPTFactory implements AIFactory {
  createAIService(): CustomGPTService {
    return new CustomGPTService();
  }
}
