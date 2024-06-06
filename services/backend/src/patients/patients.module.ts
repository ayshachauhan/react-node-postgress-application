import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities/patient';
import { PatientsService } from 'src/patients/patients.service';
import { PracticesModule } from 'src/practices/practices.module';
import { ReferrersModule } from 'src/referrers/referrers.module';
import { PatientsController } from './patients.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientEntity]),
    forwardRef(() => PracticesModule),
    forwardRef(() => ReferrersModule),
  ],
  providers: [PatientsService],
  exports: [PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}
