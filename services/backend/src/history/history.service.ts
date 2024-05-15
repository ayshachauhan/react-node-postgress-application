import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HistoryEntity, UserEntity } from '@packages/entities';
import { CalendarEntity } from '@packages/entities/calendar';
import { SurgeryService } from 'src/surgery/surgery.service';
import { Repository } from 'typeorm';
import { EvalsService } from '../evals/evals.service';
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
    private historyRepo: Repository<HistoryEntity>,
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
  }: GetHistoryParams): Promise<HistoryEntity[]> {
    return await this.historyRepo.find({
      where: {
        practice: { id: practiceId },
        user: {
          id: userId,
        },
      },
      relations: ['practice', 'surgery', 'user'],
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

//   /**
//    * Get calendar by calendarid
//    * @param params
//    * @returns CalendarEntity
//    */
//   async getCalendarBySurgeryConfiguration(
//     params: GetCalendarBySurgeryTypeIdParams,
//   ): Promise<CalendarEntity[]> {
//     const response: CalendarEntity[] | null = await this.calendarRepo.find({
//       where: {
//         surgeryConfiguration: {
//           id: params.surgeryConfigurationId,
//         },
//       },
//       relations: ['practice', 'surgeryConfiguration', 'user'],
//     });
//     if (!response) {
//       throw new NotFoundException(
//         'Calendar does not exists for this surgerytype',
//       );
//     }
//     return response;
//   }

  /**
   * Create Calendar
   * @param param0
   * @param dto
   * @returns
   */
  async createHistory(
    { practiceId, userId }: CreateHistoryParams,
    dto: CreateCalendarDto,
  ): Promise<CalendarEntity> {
    const practiceEntity = await this.practiceService.findOne(practiceId);

    const userEntity = practiceEntity?.users.find(
      (user: UserEntity) => user.id === userId,
    );

    const surgeryConfigurationEntity =
      await this.surgeryConfifurationService.getSurgeryConfigurationById(
        dto.surgeryConfigurationId,
      );

    console.log(dto, 'dtocreate');

    //TODO: need to check why we need to add the ! operator here, giving typeerror whithout them about DeepPartialEntity
    const calendar = this.calendarRepo.create({
      ...dto,
      bookedSlots: dto.bookedSlots ?? 0,
      practice: practiceEntity!,
      surgeryConfiguration: surgeryConfigurationEntity!,
      user: userEntity!,
    });

    return this.calendarRepo.save(calendar);
  }
}
