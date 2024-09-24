import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  InternalServerErrorException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ChatbotLogsEntity } from '@packages/entities';
import * as crypto from 'crypto';
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
    logger.info(chatDto, 'Input chat data');
    logger.info(twilioHeader, 'Twilio Header');

    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twiml = new MessagingResponse();
    const url = 'https://app-qa.pod111.com/AI/sms?type=openai';

    if (!authToken) {
      logger.error('Twilio Auth Token is not set');
      throw new InternalServerErrorException('Twilio Auth Token is not set');
    }

    const generateTwilioSignature = (
      authToken: string,
      url: string,
      params: smsChatDto,
    ) => {
      const sortedParams = Object.keys(params)
        .sort()
        .reduce((acc, key) => acc + key + params[key], '');
      const data = url + sortedParams;
      const hmac = crypto.createHmac('sha1', authToken);
      hmac.update(data);
      return hmac.digest('base64');
    };

    const generatedSignature = generateTwilioSignature(authToken, url, chatDto);

    if (generatedSignature !== twilioHeader) {
      logger.error('Invalid Twilio request signature');
      throw new BadRequestException('Invalid Twilio request signature');
    }

    try {
      const aibotReply = await this.aiClientService.smsChat(type, {
        phoneNumber: chatDto.from,
        question: chatDto.body,
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
