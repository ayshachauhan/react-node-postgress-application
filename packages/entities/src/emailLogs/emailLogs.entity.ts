import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { EmailData, EmailResponse, IEmailLog } from './emailLogs.interface';

@Entity('email_logs')
export class EmailLogEntity extends BaseEntity implements IEmailLog {
  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  data: EmailData;

  @Column({ type: 'jsonb', nullable: true })
  response: EmailResponse;

  @Column({ type: 'date' })
  expectedDate: Date;
}
