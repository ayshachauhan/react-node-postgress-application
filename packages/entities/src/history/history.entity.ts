import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { EvalEntity } from '../eval/eval.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { SurgeryEntity } from '../surgery';
import {
  HistoryLogAction,
  HistoryLogType,
  IHistory,
} from './history.interface';

@Entity('history')
export class HistoryEntity extends BaseEntity implements IHistory {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => SurgeryEntity)
  @JoinColumn({ name: 'surgeryId' })
  surgery: SurgeryEntity;

  @ManyToOne(() => EvalEntity)
  @JoinColumn({ name: 'evalId' })
  eval: EvalEntity;

  @Column({
    type: 'enum',
    enum: HistoryLogType,
    nullable: true,
  })
  historyLogType: HistoryLogType;

  @Column({ type: 'enum', enum: HistoryLogAction, nullable: true })
  action: HistoryLogAction;

  @Column({ type: 'jsonb', nullable: true })
  changes?: Record<string, unknown>;
}
