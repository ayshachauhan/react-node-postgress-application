import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarController } from './calendar.controller';

import { CalendarEntity } from '@packages/entities';
import { EvalsModule } from 'src/evals/evals.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { UsersModule } from 'src/users/users.module';
import { PracticesModule } from '../practices/practices.module';
import { SurgeryTypesModule } from '../surgeryTypes/surgeryTypes.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => SurgeryTypesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
  ],
  controllers: [CalendarController],
  providers: [practiceNotFoundInterceptor, CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
