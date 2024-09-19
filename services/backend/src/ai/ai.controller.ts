import { Body, Controller, Post, Query } from '@nestjs/common';
import logger from '../logger';
import { AIClientService } from './ai.service';
import { smsChatDto } from './dto/smsChat.dto';

@Controller('/ai')
export class AIController {
  constructor(private readonly aiClientService: AIClientService) {}

  @Post('/sms')
  postQuestionToAIBot(
    @Body() chatDto: smsChatDto,
    @Query('type') type: 'openai' | 'customgpt',
  ): Promise<string> {
    logger.info(chatDto, 'Input chat data');
    return this.aiClientService.smsChat(type, {
      phoneNumber: chatDto.from,
      question: chatDto.body,
    });
  }
}
