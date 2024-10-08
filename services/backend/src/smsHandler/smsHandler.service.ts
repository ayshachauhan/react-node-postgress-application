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

  async updateStatus(emailLogId: string, messageStatus: string): Promise<void> {
    try {
      await this.messageRepository.update(
        { id: emailLogId },
        {
          smsStatus: messageStatus,
        },
      );

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
