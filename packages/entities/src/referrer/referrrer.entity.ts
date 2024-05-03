import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PatientEntity } from '../patient';
import { IReferrer } from '../referrer';
import { ReferrerType } from '../referrer/referrrer.interface';

@Entity('referrers')
export class ReferrersEntity extends BaseEntity implements IReferrer {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'enum', enum: ReferrerType })
  referrerType: ReferrerType;

  @OneToMany(() => PatientEntity, (patient) => patient.referrer)
  patients: PatientEntity[];
}
