import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurgeryEntity } from '@packages/entities';
import { InsuranceTypesModule } from 'src/insuranceTypes/insuranceTypes.module';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticeHomesModule } from 'src/practiceHomes/practiceHomes.module';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryConfigurationsModule } from 'src/surgeryConfiguration/surgeryConfiguration.module';
import { SurgeryTypesModule } from 'src/surgeryTypes/surgeryTypes.module';
import { UsersModule } from 'src/users/users.module';
import { SurgeryController } from './surgery.controller';
import { SurgeryService } from './surgery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SurgeryEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => SurgeryTypesModule),
    forwardRef(() => PracticeHomesModule),
    forwardRef(() => InsuranceTypesModule),
    forwardRef(() => SurgeryConfigurationsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [
    practiceNotFoundInterceptor,
    {
      provide: 'PRACTICE_NOT_FOUND_MESSAGE',
      useValue: 'Practice not found',
    },
    SurgeryService,
  ],
  controllers: [SurgeryController],
  exports: [SurgeryService],
})
export class SurgeryModule {}
