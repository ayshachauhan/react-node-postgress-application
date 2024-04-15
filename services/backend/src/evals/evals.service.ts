import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EvalEntity } from 'src/entities/eval.entity';
import { PatientEntity } from 'src/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { PracticeHomesService } from 'src/practiceHomes/practiceHomes.service';
import { PracticesService } from 'src/practices/practices.service';
import { SurgeryTypesService } from 'src/surgeryTypes/surgeryTypes.service';
import { Repository } from 'typeorm';

@Injectable()
export class EvalsService {
  constructor(
    @InjectRepository(EvalEntity)
    private evalRepository: Repository<EvalEntity>,
    @Inject(forwardRef(() => PracticesService))
    private practiceService: PracticesService,
    @Inject(forwardRef(() => PatientsService))
    private patientService: PatientsService,
    @Inject(forwardRef(() => SurgeryTypesService))
    private surgeryTypeService: SurgeryTypesService,
    @Inject(forwardRef(() => PracticeHomesService))
    private practiceHomesService: PracticeHomesService,
  ) {}

  async findAll(): Promise<EvalEntity[]> {
    return await this.evalRepository.find({});
  }

  async getEvalById(id: string): Promise<EvalEntity | null> {
    return await this.evalRepository.findOneBy({ id });
  }

  async create({ practiceId, createEvalDto }): Promise<EvalEntity> {
    const newEval: EvalEntity = new EvalEntity();
    const practiceEntity = await this.practiceService.findOne(practiceId);
    const newPatient: PatientEntity = await this.patientService.create(
      createEvalDto,
      practiceEntity,
    );
    const surgeryTypeEntity = await this.surgeryTypeService.getSurgeryTypeById(
      createEvalDto.surgeryTypeId,
      practiceId,
    );
    const practiceHomeEntity =
      await this.practiceHomesService.getPracticeHomeById(
        createEvalDto.practiceHomeId,
        practiceId,
      );
    return await this.evalRepository.save({
      ...newEval,
      ...createEvalDto,
      practice: practiceEntity,
      patient: newPatient,
      surgeryType: surgeryTypeEntity,
      practiceHome: practiceHomeEntity,
    });
  }

  async update({ createEvalDto, id }): Promise<EvalEntity | null> {
    const evalToUpdate = await this.getEvalById(id);

    await this.evalRepository.update(id, {
      ...evalToUpdate,
      ...createEvalDto,
    });

    return await this.evalRepository.findOne({
      where: { id },
    });
  }

  async remove(id: string): Promise<void> {
    await this.evalRepository.softDelete(id);
  }
}
