import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { TransporterModule } from 'src/transporter';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([EmailLogEntity]),
    TransporterModule,
    forwardRef(() => SurgeryModule),
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
