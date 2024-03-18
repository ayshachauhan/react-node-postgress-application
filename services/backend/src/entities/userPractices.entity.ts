import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PracticeEntity } from './practices.entity';
import { User } from './users.entity';

@Entity('user_practices')
export class UserPracticeEntity extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;
}
