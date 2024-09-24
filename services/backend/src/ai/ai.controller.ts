import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ChatbotLogsEntity } from '@packages/entities';
import { Response } from 'express';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import logger from '../logger';
import { AIClientService } from './ai.service';
import { smsChatDto } from './dto/smsChat.dto';
import { GetChatParams } from './types';

@Controller('/ai')
export class AIController {
  constructor(private readonly aiClientService: AIClientService) {}

  @Post('/sms')
  async postQuestionToAIBot(
    @Body() chatDto: smsChatDto,
    @Query('type') type: 'openai' | 'customgpt',
    @Headers('x-twilio-signature') twilioHeader: string,
    @Res() res: Response,
  ) {
    logger.info(`Input chat data ${JSON.stringify(chatDto)}`);
    logger.info(`Twilio Header: ${twilioHeader}`);

    const twiml = new MessagingResponse();

    try {
      const aibotReply = await this.aiClientService.smsChat(type, {
        phoneNumber: chatDto.From,
        question: chatDto.Body,
      });
      twiml.message(aibotReply);
    } catch (error) {
      console.error(error);
      twiml.message("I'm sorry, I couldn't process that.");
    }

    res.type('text/xml').send(twiml.toString());
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
