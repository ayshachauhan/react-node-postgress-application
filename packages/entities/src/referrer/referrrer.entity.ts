import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IPatient, PatientEntity } from '../patient';
import { IReferrer } from '../referrer';
import { ReferrerType } from '../referrer/referrrer.interface';

@Entity('referrers')
export class ReferrersEntity extends BaseEntity implements IReferrer {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'enum', enum: ReferrerType })
  referrerType: ReferrerType;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToMany(() => PatientEntity, (patient) => patient.referrer)
  patients: IPatient[];
}
