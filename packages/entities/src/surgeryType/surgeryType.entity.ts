import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice';
import { ISurgeryType } from './surgeryType.interface';

@Entity('surgery_types')
export class SurgeryTypeEntity extends BaseEntity implements ISurgeryType {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  color: string;
}
