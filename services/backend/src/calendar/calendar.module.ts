import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryEntity } from '@packages/entities/surgery';
import { CalendarController } from './calendar.controller';

import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryTypesModule } from '../surgeryTypes/surgeryTypes.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurgeryEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => SurgeryTypesModule),
  ],
  controllers: [CalendarController],
  providers: [practiceNotFoundInterceptor, CalendarService],
  exports: [CalendarService],
})
export class MediaModule {}
