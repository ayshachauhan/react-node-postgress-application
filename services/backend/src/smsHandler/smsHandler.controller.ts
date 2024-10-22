import {
  Body,
  Controller,
  Headers,
  InternalServerErrorException,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as twilio from 'twilio';
import logger from '../logger';
import { SmsHandlerService } from './smsHandler.service';

interface SmsStatusUpdateDto {
  MessageSid: string;
  MessageStatus: string;
  SmsSid?: string;
  To?: string;
  From?: string;
  AccountSid?: string;
  ErrorCode?: string;
}

@Controller('sms')
export class SmsHandlerController {
  constructor(private readonly smsService: SmsHandlerService) {}

  @Post('status/:recordId')
  async updateSmsStatus(
    @Param('recordId') recordId: string,
    @Res() res: Response,
    @Body() body: SmsStatusUpdateDto,
    @Headers('x-twilio-signature') twilioHeader: string,
  ) {
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const webhookUrl = `${process.env.TWILIO_DELIVERY_STATUS_WEBHOOK_URL}/sms/status/${recordId}`;

    if (!authToken) {
      logger.error('Twilio Auth Token is not set');
      throw new InternalServerErrorException('Twilio Auth Token is not set');
    }

    if (!webhookUrl) {
      logger.error('Twilio Webhook Url is not set');
      throw new InternalServerErrorException('Twilio Webhook Url is not set');
    }

    if (!body) {
      return res
        .status(400)
        .json({ message: 'Invalid request, body is missing' });
    }

    const generatedSignature = twilio.getExpectedTwilioSignature(
      authToken,
      webhookUrl,
      body,
    );
    logger.info(`Twilio header: ${twilioHeader}`);
    logger.info(`Generated Twilio Signature: ${generatedSignature}`);

    const isValidRequest = twilio.validateRequest(
      authToken,
      twilioHeader,
      webhookUrl,
      body,
    );

    if (!isValidRequest) {
      logger.info('Invalid Twilio request');
      return res.status(403).json({ message: 'Invalid Twilio request' });
    }

    try {
      const messageSid = body.MessageSid;
      const messageStatus = body.MessageStatus;
      const smsErrorCode = body.ErrorCode || null;

      if (!messageSid || !messageStatus) {
        return res
          .status(400)
          .json({ message: 'Required Twilio fields are missing' });
      }

      logger.info(`Email log ID: ${recordId}`);
      logger.info(`Message SID: ${messageSid}`);
      logger.info(`Message Status: ${messageStatus}`);
      logger.info(`Twilio Error Code (if any): ${smsErrorCode}`);

      await this.smsService.updateStatus(recordId, messageStatus);

      logger.info('SMS status updated successfully');
      return res.status(200).send('SMS status updated successfully'); // Send response to Twilio
    } catch (error) {
      logger.info('Error updating SMS status:', error);
      return res.status(500).send('Internal server error');
    }
  }
}
