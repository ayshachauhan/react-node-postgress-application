import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { EvalEntity } from '../eval/eval.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { SurgeryEntity } from '../surgery/surgery.entity';
import { UserEntity } from '../user/user.entity';
import {
  EntityChanges,
  HistoryAction,
  HistoryType,
  IHistory,
} from './history.interface';

@Entity('history')
export class HistoryEntity extends BaseEntity implements IHistory {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
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
  changes?: EntityChanges;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;

  entityData?: {} | SurgeryEntity | EvalEntity | undefined;
}
