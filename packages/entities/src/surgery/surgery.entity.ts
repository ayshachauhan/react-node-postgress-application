import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { InsuranceTypeEntity } from '../insuranceType';
import { PatientEntity } from '../patient';
import { PracticeHomesEntity } from '../practiceHomes';
import { SurgeryTypeEntity } from '../surgeryType';
import { UserEntity } from '../user';
import { ProcedureStatus } from './surgery.interface';

@Entity('surgeries')
export class SurgeryEntity extends BaseEntity {
  @ManyToOne(() => SurgeryTypeEntity)
  @JoinColumn({ name: 'surgeryTypeId' })
  surgeryType: SurgeryTypeEntity;

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

  @Column()
  date: Date;

  @Column()
  eye: string;

  @Column()
  lensType: string;

  @Column({ type: 'enum', enum: ProcedureStatus })
  surgeryStatus: ProcedureStatus;
}
