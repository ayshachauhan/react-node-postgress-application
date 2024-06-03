import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities/emailLogs';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private messageRepository: Repository<EmailLogEntity>,
  ) {}

  async getMessagesByPractice(practiceId: string): Promise<EmailLogEntity[]> {
    return this.messageRepository.find({
      where: { practice: { id: practiceId } },
    });
  }

  async getMessageById(
    id: string,
    practiceId: string,
  ): Promise<EmailLogEntity | null> {
    if (id) {
      return this.messageRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });
    }
    return null;
  }
}
