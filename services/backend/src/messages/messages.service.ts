import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatbotLogsEntity } from '@packages/entities';
import { EmailLogEntity } from '@packages/entities/emailLogs';
import { GetMessageParams } from 'src/messages/types';
import {
  Brackets,
  FindManyOptions,
  FindOptionsWhere,
  Raw,
  Repository,
} from 'typeorm';

type SmsLog =
  | (ChatbotLogsEntity & { type: 'chatbot' })
  | (EmailLogEntity & { type: 'sms' });

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private messageRepository: Repository<EmailLogEntity>,
    @InjectRepository(ChatbotLogsEntity)
    private chatbotRepository: Repository<ChatbotLogsEntity>,
  ) {}

  async getMessagesByPractice(
    practiceId: string,
    searchMRNName?: string,
  ): Promise<EmailLogEntity[]> {
    const whereClause: FindOptionsWhere<EmailLogEntity> = {
      practice: { id: practiceId },
    };

    if (searchMRNName) {
      updateWhereClauseWithSearchName(whereClause, searchMRNName);
    }

    const searchConditions: FindManyOptions<EmailLogEntity> = {
      where: whereClause,
      order: {
        dateCreated: 'DESC',
      },
    };

    const messages = await this.messageRepository.find(searchConditions);
    return messages;
  }

  /**
   * Get all sms history for a specific patient
   * @param param0
   * @returns SMSLog[]
   */
  async getAllSmsLogs({
    practiceId,
    patientId,
    mrn,
    email,
  }: GetMessageParams): Promise<SmsLog[]> {
    const chatbotQueryBuilder = this.chatbotRepository
      .createQueryBuilder('chatbotlogs')
      .where('chatbotlogs.practiceId = :practiceId', { practiceId });

    if (patientId) {
      chatbotQueryBuilder.andWhere('chatbotlogs.patientId = :patientId', {
        patientId,
      });
    }

    chatbotQueryBuilder
      .leftJoinAndSelect('chatbotlogs.patient', 'patient')
      .orderBy('chatbotlogs.dateCreated', 'DESC');

    if (mrn) {
      chatbotQueryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('patient.mrn = :mrn', { mrn });
        }),
      );
    }

    // Fetch data from the email_logs table
    const emailLogsQueryBuilder = this.messageRepository
      .createQueryBuilder('email_logs')
      .where('email_logs.data::jsonb @> :emailCondition', {
        emailCondition: JSON.stringify({ to: email }),
      })
      .andWhere(
        "email_logs.data::jsonb ->> 'text' IS NOT NULL AND trim(email_logs.data::jsonb ->> 'text') != ''",
      );

    const [chatbotLogs, emailLogs] = await Promise.all([
      chatbotQueryBuilder.getMany(),
      emailLogsQueryBuilder.getMany(),
    ]);

    // Combine the results
    const combinedLogs: SmsLog[] = [
      ...chatbotLogs.map((log) => ({
        type: 'chatbot' as const,
        ...log,
      })),
      ...emailLogs.map((log) => ({
        type: 'sms' as const,
        ...log,
      })),
    ];

    return combinedLogs.sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
    );
  }
}

function updateWhereClauseWithSearchName(
  whereClause: FindOptionsWhere<EmailLogEntity>,
  searchMRNName: string,
): void {
  whereClause.data = Raw(
    (alias) =>
      `(${alias} ->> 'fname' ILIKE :search OR ${alias} ->> 'mrn' ILIKE :search OR ${alias} ->> 'lname' ILIKE :search)`,
    { search: `%${searchMRNName}%` },
  );
}
