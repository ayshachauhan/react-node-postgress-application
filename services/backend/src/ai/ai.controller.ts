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
import { ChatbotLogsEntity, EmailLogEntity } from '@packages/entities';
import { Response } from 'express';
import * as twilio from 'twilio';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';
import logger from '../logger';
import { AIClientService } from './ai.service';
import { smsChatDto } from './dto/smsChat.dto';
import { GetChatParams, GetMessageParams } from './types';

type SmsLog =
  | (ChatbotLogsEntity & { type: 'chatbot' })
  | (EmailLogEntity & { type: 'sms' });

@Controller('/ai')
export class AIController {
  constructor(private readonly aiClientService: AIClientService) {}

  @Post('sms')
  async postQuestionToAIBot(
    @Body() chatDto: smsChatDto,
    @Query('type') type: 'openai' | 'customgpt',
    @Headers('x-twilio-signature') twilioHeader: string,
    @Res() res: Response,
  ) {
    logger.info(`Input chat data ${JSON.stringify(chatDto)}`);
    logger.info(`Twilio Header: ${twilioHeader}`);

    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twiml = new MessagingResponse();
    const webhookUrl = process.env.TWILIO_AIMSG_WEBHOOK_URL;

    if (!authToken) {
      logger.error('Twilio Auth Token is not set');
      throw new InternalServerErrorException('Twilio Auth Token is not set');
    }

    if (!webhookUrl) {
      logger.error('Twilio Webhook Url is not set');
      throw new InternalServerErrorException('Twilio Webhook Url is not set');
    }

    const generatedSignature = twilio.getExpectedTwilioSignature(
      authToken,
      webhookUrl,
      chatDto,
    );
    logger.info(`Generated Twilio Signature: ${generatedSignature}`);

    const isValid = twilio.validateRequest(
      authToken,
      twilioHeader,
      webhookUrl,
      chatDto,
    );

    if (!isValid) {
      logger.error('Invalid Twilio request signature');
      throw new BadRequestException('Invalid Twilio request signature');
    }
    logger.info(`Twilio request verification: ${isValid}`);

    try {
      const aibotReply = await this.aiClientService.smsChat(type, {
        phoneNumber: chatDto.From,
        question: chatDto.Body,
      });
      logger.info(`Bot reply: ${aibotReply}`);
      twiml.message(aibotReply);
    } catch (error) {
      logger.error(error);
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

  @Get('logs')
  getHistory(@Query() query: GetMessageParams): Promise<SmsLog[]> {
    return this.aiClientService.getAllLogs({
      practiceId: query.practiceId,
      patientId: query.patientId,
      mrn: query.mrn,
      email: query.email,
    });
  }
}
