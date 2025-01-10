import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { ENVIRONMENT_VARIABLES } from '../enums/environment.enums';

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
    private configService: ConfigService,
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
      .where("email_logs.data::jsonb ->> 'to' = :email", { email: email! })
      .andWhere(
        "email_logs.data::jsonb ->> 'text' IS NOT NULL AND trim(email_logs.data::jsonb ->> 'text') != ''",
      );

    const showAIChat = await this.configService.get(
      ENVIRONMENT_VARIABLES.NEXT_PUBLIC_ENABLE_AI_CHAT,
    );

    console.log(
      '-----------------------------Generated SQL Query:',
      emailLogsQueryBuilder.getQuery(),
    );

    const [chatbotLogs, emailLogs] = await Promise.all([
      chatbotQueryBuilder.getMany(),
      emailLogsQueryBuilder.getMany(),
    ]);

    console.log(emailLogs);
    console.log('---------------');
    console.log(chatbotLogs);
    console.log('--------------->>>>>>>>>');

    // Combine logs
    const combinedLogs: SmsLog[] = [
      ...(showAIChat === true
        ? chatbotLogs.map((log) => ({
            type: 'chatbot' as const,
            ...log,
          }))
        : []),
      ...emailLogs.map((log) => ({
        type: 'sms' as const,
        ...log,
      })),
    ];

    console.log(combinedLogs);

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
