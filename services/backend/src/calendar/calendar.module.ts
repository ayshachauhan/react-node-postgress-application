import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';

import { CalendarEntity } from '@packages/entities';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryConfigurationsModule } from '../surgeryConfiguration/surgeryConfiguration.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => SurgeryConfigurationsModule),
  ],
  controllers: [CalendarController],
  providers: [practiceNotFoundInterceptor, CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
