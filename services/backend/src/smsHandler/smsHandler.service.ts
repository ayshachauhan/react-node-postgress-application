import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities';
import logger from 'src/logger';
import { Repository } from 'typeorm';

@Injectable()
export class SmsHandlerService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private messageRepository: Repository<EmailLogEntity>,
  ) {}

  async getLogById(emailLogId: string): Promise<EmailLogEntity[]> {
    try {
      if (emailLogId) {
        return await this.messageRepository.find({
          where: {
            id: emailLogId,
          },
        });
      }
    } catch (error) {
      const errorMessage = (error as Error).message || 'An error occurred';
      logger.error(
        `Failed to update SMS status for record ${emailLogId}: ${errorMessage}`,
      );
      throw new Error('Failed to update SMS status');
    }
    return [];
  }

  async updateStatus(emailLogId: string, messageStatus: string): Promise<void> {
    try {
      const message: EmailLogEntity | null =
        await this.messageRepository.findOne({
          where: {
            id: emailLogId,
          },
        });

      if (message) {
        if (
          message?.smsAttempts < 1 &&
          (messageStatus === 'failed' || messageStatus === 'undelivered')
        ) {
          logger.warn(`Retrying SMS for log ID: ${emailLogId}`);
          await this.messageRepository.update(
            { id: emailLogId },
            {
              smsAttempts: () => 'smsAttempts + 1',
              smsStatus: 'queued',
            },
          );
          logger.info(`Updating SMS log ID: ${emailLogId} to status: queued`);
        } else {
          logger.warn(
            `Updating SMS log ID: ${emailLogId} to status: ${messageStatus}`,
          );
          await this.messageRepository.update(
            { id: emailLogId },
            {
              smsStatus: messageStatus,
            },
          );
          logger.info(
            `Updated SMS log ID: ${emailLogId} to status: ${messageStatus}`,
          );
        }
      }

      logger.info(
        `Updated SMS status for record ${emailLogId}: ${messageStatus}`,
      );
    } catch (error) {
      const errorMessage = (error as Error).message || 'An error occurred';
      logger.error(
        `Failed to update SMS status for record ${emailLogId}: ${errorMessage}`,
      );
      throw new Error('Failed to update SMS status');
    }
  }
}
