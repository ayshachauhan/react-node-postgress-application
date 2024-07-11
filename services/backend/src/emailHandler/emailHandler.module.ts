import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EmailLogEntity,
  EvalEmailEntity,
  SurgeryEmailEntity,
} from '@packages/entities';
import { EmailHandlerService } from 'src/emailHandler/emailHandler.service';
import { EvalsModule } from 'src/evals/evals.module';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { TransporterModule } from 'src/transporter';
import { UsersModule } from 'src/users/users.module';
import { EmailHandlerController } from './emailHandler.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmailLogEntity,
      EvalEmailEntity,
      SurgeryEmailEntity,
    ]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => SurgeryConfigurationsModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TemplatesModule),
    forwardRef(() => TransporterModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => EvalsModule),
  ],
  providers: [
    practiceNotFoundInterceptor,
    {
      provide: 'PRACTICE_NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
    EmailHandlerService,
  ],
  exports: [EmailHandlerService],
  controllers: [EmailHandlerController],
})
export class EmailHandlerModule {}
