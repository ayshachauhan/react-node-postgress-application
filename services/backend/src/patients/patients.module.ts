import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from '@packages/entities/patient';
import { PatientsService } from 'src/patients/patients.service';
import { PracticesModule } from 'src/practices/practices.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientEntity]),
    forwardRef(() => PracticesModule),
  ],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
