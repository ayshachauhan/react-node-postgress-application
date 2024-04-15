import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientEntity } from 'src/entities/patients.entity';
import { PracticesModule } from 'src/practices/practices.module';
import { PatientsService } from './patients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientEntity]),
    forwardRef(() => PracticesModule),
  ],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
