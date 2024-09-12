import { Injectable } from '@nestjs/common';
import { AIService } from './ai-service.interface';

@Injectable()
export class CustomGPTService implements AIService {
  async doSMSChat(data: {
    phoneNumber: string;
    question: string;
  }): Promise<string> {
    return `CustomGPT processed ${JSON.stringify(data)}`;
  }
}
