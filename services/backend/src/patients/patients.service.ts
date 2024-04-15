import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientEntity } from 'src/entities/patients.entity';
import { PracticeEntity } from 'src/entities/practices.entity';

import { Repository } from 'typeorm';
import { CreatePatientDto } from './dto/createPatient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
  ) {}

  async remove(patientId: string): Promise<void> {
    await this.patientRepository.softDelete(patientId);
  }

  async create(
    createPatientDto: CreatePatientDto,
    practiceEntity: PracticeEntity | null,
  ): Promise<PatientEntity> {
    const newPatient: PatientEntity = new PatientEntity();

    if (!practiceEntity) {
      throw new HttpException('practice not found', HttpStatus.NOT_FOUND);
    }

    return await this.patientRepository.save({
      ...newPatient,
      practice: practiceEntity,
      ...createPatientDto,
    });
  }

  async update({ id, practiceId }): Promise<PatientEntity | null> {
    await this.patientRepository.update(id, {
      //  ÷
    });

    return await this.patientRepository.findOne({
      where: { id, practice: { id: practiceId } },
    });
  }

  async getUsersByPractice(practiceId: string): Promise<PatientEntity[]> {
    return this.patientRepository.find({
      where: { practice: { id: practiceId } },
    });
  }
}
