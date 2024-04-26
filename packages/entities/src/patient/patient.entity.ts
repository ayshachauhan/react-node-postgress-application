import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice';
import { ReferrersEntity } from '../referrer';

@Entity('patients')
export class PatientEntity extends BaseEntity {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => ReferrersEntity)
  @JoinColumn({ name: 'referrerId' })
  referrer: ReferrersEntity;

  @Column({ type: 'varchar' })
  mrn: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  phoneNumber: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'varchar' })
  pcp: string;

  @Column({ type: 'varchar' })
  details: string;
}
