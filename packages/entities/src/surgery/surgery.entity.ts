import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { InsuranceTypeEntity } from '../insuranceType';
import { PatientEntity } from '../patient';
import { PracticeEntity } from '../practice';
import { PracticeHomesEntity } from '../practiceHomes';
import { SurgeryConfigurationEntity } from '../surgeryConfiguration';
import { UserEntity } from '../user';
import { WaitlistEntity } from '../waitlist';
import {
  CheckListOptions,
  ISurgery,
  SelectedConditionalOption,
  SelectedSurgeryOption,
  SurgeryStatus,
} from './surgery.interface';

@Entity('surgeries')
export class SurgeryEntity extends BaseEntity implements ISurgery {
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

  @ManyToOne(() => WaitlistEntity)
  @JoinColumn({ name: 'waitlistId' })
  waitlist: WaitlistEntity;

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

  @Column({ type: 'enum', enum: SurgeryStatus })
  surgeryStatus: SurgeryStatus;

  @Column()
  totalHospitalPricing: string;

  @Column()
  totalProfessionalPricing: string;

  @Column({ type: 'jsonb', nullable: true })
  selectedCheckListOptions: CheckListOptions;

  @Column({ type: 'jsonb', nullable: true })
  selectedConditionalOptions: SelectedConditionalOption;

  @Column()
  surgeryOrder: number;

  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity; //TO DO: make practice id not null in future

  @Column()
  identifier: string;

  @Column()
  count: number;
}
