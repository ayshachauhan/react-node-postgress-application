import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { InsuranceTypeEntity } from '../insuranceType';
import { PatientEntity } from '../patient';
import { PracticeHome } from '../practiceHomes';
import { SurgeryTypeEntity } from '../surgeryType';
import { User } from '../user';

@Entity('surgeries')
export class SurgeryEntity extends BaseEntity {
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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column({ type: 'varchar' })
  insuranceDetails: string;

  @Column()
  date: Date;

  @Column()
  eye: string;

  @Column()
  lensType: string;
}
