import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities/patient';
import { PracticeEntity } from '@packages/entities/practice';
import { ReferrersEntity } from '@packages/entities/referrer';
import { practiceNotFoundInterceptor } from 'src/interceptors/practiceNotFoundInterceptor';
import { PatientsModule } from 'src/patients/patients.module';
import { PracticesModule } from 'src/practices/practices.module';
import { SurgeryModule } from 'src/surgery/surgery.module';
import { UsersModule } from 'src/users/users.module';
import { ReferrersController } from './referrers.controller';
import { ReferrersService } from './referrers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReferrersEntity, PracticeEntity, PatientEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => PatientsModule),
    forwardRef(() => SurgeryModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ReferrersController],
  providers: [ReferrersService, practiceNotFoundInterceptor],
  exports: [ReferrersService],
})
export class ReferrersModule {}
