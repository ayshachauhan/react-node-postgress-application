import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PracticeEntity } from './practices.entity';

@Entity('patients')
export class PatientEntity extends BaseEntity {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

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
  referrer: string;
}
