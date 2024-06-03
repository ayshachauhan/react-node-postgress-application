import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TransporterModule } from 'src/transporter';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), TransporterModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
