import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TemplateEntity } from '../template';
import { EmailData, EmailResponse, IEmailLog } from './emailLogs.interface';

@Entity('email_logs')
export class EmailLogEntity extends BaseEntity implements IEmailLog {
  @Column({ type: 'varchar' })
  surgeryId: string;

  @ManyToOne(() => TemplateEntity, { nullable: true })
  @JoinColumn({ name: 'templateId' })
  template: TemplateEntity;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  data: EmailData;

  @Column({ type: 'jsonb', nullable: true })
  response: EmailResponse;

  @Column({ type: 'varchar', nullable: true })
  systemTemplateName: string;

  @Column({ type: 'date' })
  expectedDate: Date;

  @Column({ type: 'boolean' })
  isEval: boolean;
}
