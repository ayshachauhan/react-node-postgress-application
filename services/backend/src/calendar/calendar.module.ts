import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryEntity } from '@packages/entities/surgery';
import { CalendarController } from './calendar.controller';

import { CalendarService } from './calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([SurgeryEntity])],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class MediaModule {}
