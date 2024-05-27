import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLogEntity } from '@packages/entities';
import { EmailHandlerService } from 'src/emailHandler/emailHandler.service';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { TemplatesModule } from 'src/templates/templates.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailLogEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => SurgeryConfigurationsModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => UsersModule),
    forwardRef(() => TemplatesModule),
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
})
export class EmailHandlerModule {}
