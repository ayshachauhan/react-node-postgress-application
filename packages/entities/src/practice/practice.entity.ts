import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { IPractice, PracticeStatus } from './practice.interface';

@Entity('practices')
export class PracticeEntity extends BaseEntity implements IPractice {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({
    type: 'enum',
    enum: PracticeStatus,
    enumName: 'practice_status',
    default: 'pending',
  })
  status: PracticeStatus;

  @Column({ type: 'varchar', nullable: true })
  photoUrl: string;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'user_practices',
    joinColumn: { name: 'practiceId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: UserEntity[];
}
