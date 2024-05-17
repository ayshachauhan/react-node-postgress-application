import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { InsuranceTypeEntity } from '../insuranceType';
import { PatientEntity } from '../patient';
import { PracticeHomesEntity } from '../practiceHomes';
import { SurgeryConfigurationEntity } from '../surgeryConfiguration';
import { UserEntity } from '../user';
import { CheckListOptions, SelectedSurgeryOption } from './surgery.interface';

@Entity('surgeries')
export class SurgeryEntity extends BaseEntity {
  @ManyToOne(() => SurgeryConfigurationEntity)
  @JoinColumn({ name: 'surgeryConfigurationId' })
  surgeryConfiguration: SurgeryConfigurationEntity;

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity;

  @ManyToOne(() => PracticeHomesEntity)
  @JoinColumn({ name: 'practiceHomeId' })
  practiceHome: PracticeHomesEntity;

  @ManyToOne(() => InsuranceTypeEntity)
  @JoinColumn({ name: 'insuranceTypeId' })
  insuranceType: InsuranceTypeEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'doctorId' })
  doctor: UserEntity;

  @Column({ type: 'varchar' })
  insuranceDetails: string;

  @Column({
    default: null,
    nullable: true,
  })
  date: Date;

  @Column()
  bodyPart: string;

  @Column({ type: 'jsonb' })
  selectedSurgeryOptions: SelectedSurgeryOption;

  @Column()
  totalHospitalPricing: number;

  @Column()
  totalProfessionalPricing: number;

  @Column({ type: 'jsonb', nullable: true })
  selectedCheckListOptions: CheckListOptions;
}
