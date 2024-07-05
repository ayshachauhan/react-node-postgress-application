import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';

import { SurgeryTypeEntity } from '../surgeryType';
import {
  ISurgeryConfiguration,
  SurgeryChecklist,
  SurgeryConditionalOptions,
  SurgeryOptions,
} from './surgeryConfiguration.interface';

@Entity('surgery_configurations')
export class SurgeryConfigurationEntity
  extends BaseEntity
  implements ISurgeryConfiguration
{
  @ManyToOne(() => SurgeryTypeEntity)
  @JoinColumn({ name: 'surgeryTypeId' })
  surgeryType: SurgeryTypeEntity;

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

  @Column({ type: 'jsonb', nullable: true })
  conditionalOptions: SurgeryConditionalOptions;

  @Column({ type: 'varchar', nullable: true })
  color: string;
}
