import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { InsuranceTypeEntity } from '../insuranceType';
import { PatientEntity } from '../patient';
import { PracticeHome } from '../practiceHomes';
import { SurgeryTypeEntity } from '../surgeryType';

@Entity('evals')
export class EvalEntity extends BaseEntity {
  @ManyToOne(() => SurgeryTypeEntity)
  @JoinColumn({ name: 'surgeryTypeId' })
  surgeryType: SurgeryTypeEntity;

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @ManyToOne(() => PracticeHome)
  @JoinColumn({ name: 'practiceHomeId' })
  practiceHome: PracticeHome;

  @ManyToOne(() => InsuranceTypeEntity)
  @JoinColumn({ name: 'insuranceTypeId' })
  insuranceType: InsuranceTypeEntity;

  @Column({ type: 'varchar' })
  insuranceDetails: string;

  @Column({ type: 'varchar' })
  date: string;
}
