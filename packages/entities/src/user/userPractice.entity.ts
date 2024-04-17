import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { User } from './user.entity';
import { IUserPractice } from './userPractice.interface';

@Entity('user_practices')
export class UserPracticeEntity extends BaseEntity implements IUserPractice {
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;
}
