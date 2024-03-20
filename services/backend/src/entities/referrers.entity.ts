import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('referrers')
export class Referrers extends BaseEntity {
  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'enum', enum: ['PCP', 'ORTHO', 'SURGEON'] })
  referrerType: string;
}
