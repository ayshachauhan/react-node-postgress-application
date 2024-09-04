import { AIService } from './ai-service.interface';

export interface AIFactory {
  createAIService(): AIService;
}
