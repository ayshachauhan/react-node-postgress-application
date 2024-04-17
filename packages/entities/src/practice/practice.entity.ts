import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { IPractice, PracticeStatus } from '.';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';

@Entity('practices')
export class PracticeEntity extends BaseEntity implements IPractice {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({
    type: 'enum',
    enum: PracticeStatus,
    default: PracticeStatus.PENDING,
  })
  status: PracticeStatus;

  @Column({ type: 'varchar' })
  photoUrl: string;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_practices',
    joinColumn: { name: 'practiceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: User[];
}
