import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatbotLogsEntity } from '@packages/entities';
import logger from '../logger';
import { AIClientService } from './ai.service';
import { smsChatDto } from './dto/smsChat.dto';
import { GetChatParams } from './types';

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

  @Get()
  getAllHistory(@Query() query: GetChatParams): Promise<ChatbotLogsEntity[]> {
    return this.aiClientService.getAllChatLogs({
      practiceId: query.practiceId,
      patientId: query.patientId,
      mrn: query.mrn,
      answer: query.answer,
    });
  }
}
