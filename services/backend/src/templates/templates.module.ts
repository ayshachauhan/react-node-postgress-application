import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateEntity } from '@packages/entities/template';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EvalsModule } from 'src/evals/evals.module';
import { HistoryModule } from 'src/history/history.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { MediaModule } from 'src/media/media.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { ReferrersModule } from 'src/referrers/referrers.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { S3Service } from 'src/users/s3.service';
import { UsersModule } from 'src/users/users.module';
import { WaitlistModule } from 'src/waitlist/waitlist.module';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TemplateEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => SurgeryConfigurationsModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => MediaModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => ReferrersModule),
    forwardRef(() => WaitlistModule),
    forwardRef(() => SurgeryTypesModule),
  ],
  providers: [TemplatesService, practiceNotFoundInterceptor, S3Service],
  controllers: [TemplatesController],
  exports: [TemplatesService],
})
export class TemplatesModule {}
