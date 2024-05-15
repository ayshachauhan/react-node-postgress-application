import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { UserEntity } from '../user/user.entity';
import { HistoryAction, HistoryType, IHistory } from './history.interface';

@Entity('history')
export class HistoryEntity extends BaseEntity implements IHistory {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'surgeonId' })
  user: UserEntity;

  // ID of the entity that this history entry is related to
  @Column({ type: 'uuid' })
  entityId: string;

  // Indicates the type of entity that this history entry is related to ('surgery' or 'eval')
  @Column({
    type: 'enum',
    enum: HistoryType,
    nullable: true,
  })
  entityType: HistoryType;

  @Column({ type: 'enum', enum: HistoryAction, nullable: true })
  action: HistoryAction;

  @Column({ type: 'jsonb', nullable: true })
  changes?: Record<string, unknown>;
}
