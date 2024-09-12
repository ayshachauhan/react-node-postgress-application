import { Body, Controller, Post } from '@nestjs/common';
//import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import logger from '../logger';
import { AIClientService } from './ai.service';
import { smsChatDto } from './dto/smsChat.dto';

// ApiTags('AI');
// @ApiBearerAuth('normal')
@Controller('/ai')
export class AIController {
  constructor(private readonly aiClientService: AIClientService) {}

  @Post('/sms')
  postQuestionToAIBot(@Body() chatDto: smsChatDto): Promise<string> {
    logger.info(chatDto, 'Input chat data');
    const { type } = chatDto;
    return this.aiClientService.smsChat(type, { ...chatDto });
  }
}
