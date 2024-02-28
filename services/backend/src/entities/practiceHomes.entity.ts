import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity'; // Import the BaseEntity
import { PracticeEntity } from './practices.entity';

@Entity('practice_homes')
export class PracticeHome extends BaseEntity {
  // Extend the BaseEntity
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'varchar' })
  name: string;
}
