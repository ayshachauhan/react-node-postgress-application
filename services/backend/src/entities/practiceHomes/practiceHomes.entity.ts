import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IPracticeHomes } from '.';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice/practice.entity';

@Entity('practice_homes')
export class PracticeHome extends BaseEntity implements IPracticeHomes {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'varchar' })
  name: string;
}
