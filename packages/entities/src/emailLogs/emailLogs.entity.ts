import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice';
import { EmailData, EmailResponse, IEmailLog } from './emailLogs.interface';

@Entity('email_logs')
export class EmailLogEntity extends BaseEntity implements IEmailLog {
  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'varchar', nullable: false, default: 'queued' })
  smsStatus: string;

  @Column({ type: 'integer', nullable: false, default: 0 })
  smsAttempts: number;

  @Column({ type: 'integer', nullable: false, default: 0 })
  emailAttempts: number;

  @Column({ type: 'jsonb', nullable: true })
  data: EmailData;

  @Column({ type: 'jsonb', nullable: true })
  response: EmailResponse;

  @Column({ type: 'timestamp' })
  expectedDate: Date;

  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'uuid' })
  practiceId: string;

  @Column({ type: 'varchar', nullable: true })
  attachment?: string;

  @Column({ type: 'boolean', nullable: false })
  isRead: boolean;
}
