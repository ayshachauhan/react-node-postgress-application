import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '@packages/entities/message';
import { Repository } from 'typeorm';
import { PracticesService } from '../practices/practices.service';
import { CreateMessageDto } from './dto/createMessage.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
    @Inject(forwardRef(() => PracticesService))
    private readonly practicesService: PracticesService,
  ) {}

  async getMessagesByPractice(practiceId: string): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      where: { practice: { id: practiceId } },
    });
  }

  async getMessageById(
    id: string,
    practiceId: string,
  ): Promise<MessageEntity | null> {
    if (id) {
      return this.messageRepository.findOne({
        where: { id, practice: { id: practiceId } },
      });
    }
    return null;
  }

  async remove(id: string, practiceId: string): Promise<void> {
    await this.messageRepository.softDelete({
      id,
      practice: { id: practiceId },
    });
  }

  async create(
    {
      emailStatus,
      emailType,
      emailDetail,
      firstName,
      lastName,
      mrn,
      caseId,
      emailOpen,
      emailSent,
      linkOpen,
      email,
      phone,
      subject,
      message,
      links,
      linksFull,
      signature,
      attachments,
      textBody,
      textStatus,
    }: CreateMessageDto,
    practiceId: string,
  ): Promise<MessageEntity> {
    const newMessage: MessageEntity = new MessageEntity();

    const practiceEntity = await this.practicesService.findOne(practiceId);
    if (!practiceEntity) {
      throw new HttpException('Practice not found', HttpStatus.NOT_FOUND);
    }

    return await this.messageRepository.save({
      ...newMessage,
      practice: practiceEntity,
      emailStatus,
      emailType,
      emailDetail,
      firstName,
      lastName,
      mrn,
      caseId,
      emailOpen,
      emailSent,
      linkOpen,
      email,
      phone,
      subject,
      message,
      links,
      linksFull,
      signature,
      attachments,
      textBody,
      textStatus,
    });
  }
}
