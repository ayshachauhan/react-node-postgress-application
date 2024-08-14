import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity, HistoryType, UserEntity } from '@packages/entities';
import { EvalsService } from 'src/evals/evals.service';
import { SurgeryService } from 'src/surgery/surgery.service';
import { PAGINATION_LIMIT } from 'src/utils/constants';
import { Repository } from 'typeorm';
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
    @Inject(forwardRef(() => SurgeryService))
    private surgeryService: SurgeryService,
    @Inject(forwardRef(() => EvalsService))
    private evalService: EvalsService,
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
  }: GetHistoryParams & {
    userId: string;
    page: number;
    limit: number;
  }): Promise<HistoryEntity[]> {
    const skip = (page - 1) * limit;
    const response = await this.historyRepo.find({
      where: {
        practice: { id: practiceId },
        user: { id: userId },
      },
      relations: ['practice', 'user'],
      order: {
        dateCreated: 'DESC',
      },
      skip,
      take: limit,
    });

    for (const log of response) {
      if (log.entityType === HistoryType.SURGERY) {
        const surgery = await this.surgeryService.getSurgeryByIdIncludeDeleted(
          log.entityId,
        );
        log.entityData = surgery || undefined;
      } else if (log.entityType === HistoryType.EVAL) {
        const evalData = await this.evalService.getEvalByIdIncludeDeleted(
          log.entityId,
        );
        log.entityData = evalData || undefined;
      } else {
        log.entityData = undefined;
      }
    }

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

    return await this.historyRepo.save(history);
  }
}
