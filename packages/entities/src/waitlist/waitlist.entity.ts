import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice';
import { IWaitlist } from './waitlist.interface';

@Entity('waitlist')
export class WaitlistEntity extends BaseEntity implements IWaitlist {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'varchar' })
  name: string;
}
