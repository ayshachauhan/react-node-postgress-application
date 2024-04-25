import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice';
import {
  ISurgeryType,
  SurgeryChecklist,
  SurgeryOptions,
} from './surgeryType.interface';

@Entity('surgery_types')
export class SurgeryTypeEntity extends BaseEntity implements ISurgeryType {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'varchar' })
  name: string;

  @Column('varchar', {
    array: true,
    default: '{}',
  })
  bodyPart: string[];

  @Column('varchar', {
    array: true,
    default: '{}',
  })
  facility: string[];

  @Column({ type: 'jsonb', nullable: true })
  options: SurgeryOptions;

  @Column({ type: 'jsonb', nullable: true })
  checkList: SurgeryChecklist;
}
