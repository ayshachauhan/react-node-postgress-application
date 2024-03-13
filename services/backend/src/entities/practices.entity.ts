import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('practices')
export class PracticeEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;
}
