import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistoryEntity } from '@packages/entities';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryModule } from '../surgery/surgery.module';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => SurgeryModule),
  ],
  controllers: [HistoryController],
  providers: [practiceNotFoundInterceptor, HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
