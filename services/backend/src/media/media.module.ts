import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '@packages/entities/media';
import { MediaConfigEntity } from '@packages/entities/mediaConfig';
import { PracticeEntity } from '@packages/entities/practice';
import { SurgeryConfigurationEntity } from '@packages/entities/surgeryConfiguration';
import { CalendarModule } from 'src/calendar/calendar.module';
import { EmailHandlerModule } from 'src/emailHandler/emailHandler.module';
import { EvalsModule } from 'src/evals/evals.module';
import { HistoryModule } from 'src/history/history.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';
import { S3Service } from '../users/s3.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MediaEntity,
      PracticeEntity,
      SurgeryConfigurationEntity,
      MediaConfigEntity,
    ]),
    forwardRef(() => PracticesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => EmailHandlerModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => EvalsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => CalendarModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => HistoryModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => PracticeHomesModule),
  ],
  controllers: [MediaController],
  providers: [MediaService, practiceNotFoundInterceptor, S3Service],
  exports: [MediaService],
})
export class MediaModule {}
