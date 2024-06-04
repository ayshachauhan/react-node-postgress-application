import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities/emailLogs';
import { FindManyOptions, FindOptionsWhere, Raw, Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(EmailLogEntity)
    private messageRepository: Repository<EmailLogEntity>,
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
