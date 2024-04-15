import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice';
import { IInsuranceType } from './insuranceType.interface';

@Entity('insurance_types')
export class InsuranceTypeEntity extends BaseEntity implements IInsuranceType {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'varchar' })
  name: string;
}
