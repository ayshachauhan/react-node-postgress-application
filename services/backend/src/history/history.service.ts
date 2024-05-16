import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity, UserEntity } from '@packages/entities';
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
  ) {}

  /**
   * Get all history for a specific practice > user
   * @param param0
   * @returns HistoryEntity[]
   */
  async getAllHistoryLogs({
    practiceId,
    userId,
  }: GetHistoryParams): Promise<HistoryEntity[]> {
    console.log(practiceId, userId, 'inhservice');
    return await this.historyRepo.find({
      where: {
        practice: { id: practiceId },
        // user: {
        //   id: userId,
        // },
      },
      relations: ['practice', 'user'],
    });
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
  async createHistory(dto: CreateHistoryParams): Promise<HistoryEntity> {
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
