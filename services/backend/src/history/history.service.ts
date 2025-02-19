import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity, UserEntity } from '@packages/entities';
import logger from 'src/logger';
import { PAGINATION_LIMIT } from 'src/utils/constants';
import { Brackets, Repository } from 'typeorm';
import { PracticesService } from '../practices/practices.service';
import {
  CreateHistoryParams,
  GetHistoryByIdParams,
  GetHistoryParams,
} from './types';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historyRepo: Repository<HistoryEntity>,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
  ) {}

  /**
   * Get all history for a specific practice > user
   * @param param0
   * @returns HistoryEntity[]
   */
  async getAllHistoryLogs({
    practiceId,
    userId,
    page,
    limit = PAGINATION_LIMIT,
    patientId,
    surgery,
  }: GetHistoryParams & {
    userId: string;
    page: number;
    limit: number;
    patientId?: string;
    surgery?: string;
  }): Promise<HistoryEntity[]> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.historyRepo
      .createQueryBuilder('history')
      .where('history.practiceId = :practiceId', { practiceId })
      .andWhere('history.userId = :userId', { userId })
      .withDeleted()
      .addSelect('eval.dateDeleted') // Explicitly select dateDeleted column
      .addSelect('surgery.dateDeleted') // Explicitly select dateDeleted column
      .leftJoinAndSelect('history.practice', 'practice')
      .leftJoinAndSelect('history.user', 'user')
      .leftJoinAndSelect(
        'history.surgery',
        'surgery',
        'surgery.dateDeleted IS NULL OR surgery.dateDeleted IS NOT NULL',
      )
      .leftJoinAndSelect(
        'history.eval',
        'eval',
        'eval.dateDeleted IS NULL OR eval.dateDeleted IS NOT NULL',
      )
      .leftJoinAndSelect('surgery.patient', 'surgeryPatient')
      .leftJoinAndSelect('surgery.surgeryConfiguration', 'surgeryConfig')
      .leftJoinAndSelect('eval.surgeryConfiguration', 'evalSurgeryConfig')
      .leftJoinAndSelect('eval.patient', 'evalPatient')
      .orderBy('history.dateCreated', 'DESC')
      .skip(skip)
      .take(limit);

    const surgeryFilter = surgery === 'undefined' ? undefined : surgery;
    const patientFilter = patientId === 'undefined' ? undefined : patientId;

    if (patientFilter && patientId) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('surgeryPatient.id = :patientId', { patientId }).orWhere(
            'evalPatient.id = :patientId',
            { patientId },
          );
        }),
      );
    }

    if (surgeryFilter && surgery) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('surgeryConfig.name = :surgery', { surgery }).orWhere(
            'evalSurgeryConfig.name = :surgery',
            { surgery },
          );
        }),
      );
    }

    const response = await queryBuilder.getMany();

    return response;
  }

  /**
   * Get history by historyid
   * @param params
   * @returns HistoryEntity
   */
  async getHistoryById(params: GetHistoryByIdParams): Promise<HistoryEntity> {
    const response: HistoryEntity | null = await this.historyRepo.findOne({
      where: { id: params.id },
      relations: ['practice', 'surgery', 'user'],
    });
    if (!response) {
      throw new NotFoundException(
        `History log does not exists for ${params?.id}`,
      );
    }
    return response;
  }

  /**
   * Create Calendar
   * @param param0
   * @param dto
   * @returns
   */
  async createHistory(
    dto: CreateHistoryParams & { userId: string },
  ): Promise<HistoryEntity> {
    logger.info(
      `Creating new history record for Entity: ${dto?.entityType}, Action: ${dto?.action}, EntityID: ${dto?.entityId}`,
    );
    const practiceEntity = await this.practiceService.findOne(dto.practiceId);

    const userEntity = practiceEntity?.users.find(
      (user: UserEntity) => user.id === dto.userId,
    );

    const history = this.historyRepo.create({
      practice: practiceEntity!,
      user: userEntity,
      entityType: dto.entityType,
      entityId: dto.entityId,
      action: dto.action,
      changes: dto.changes,
      ipAddress: dto.ipAddress,
    });

    const savedHistory = await this.historyRepo.save(history);
    logger.info(
      `New history record created successfully with ID: ${savedHistory?.id}`,
    );
    return savedHistory;
  }
}
