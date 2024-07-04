import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { InsuranceTypeEntity } from '../insuranceType';
import { PatientEntity } from '../patient';
import { PracticeEntity } from '../practice';
import { PracticeHomesEntity } from '../practiceHomes';
import { SurgeryConfigurationEntity } from '../surgeryConfiguration';
import { UserEntity } from '../user';
import { WaitlistEntity } from '../waitlist';

@Entity('evals')
export class EvalEntity extends BaseEntity {
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

  @Column()
  date: Date;

  @Column()
  status: string;

  @Column()
  bodyPart: string;

  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity; //TO DO: make practice id not null in future
}
