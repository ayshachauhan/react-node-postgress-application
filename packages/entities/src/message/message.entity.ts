import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice/practice.entity';
import {
  EmailStatus,
  EmailType,
  IMessage,
  TextStatus,
} from './message.interface';

@Entity('messages')
export class MessageEntity extends BaseEntity implements IMessage {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'enum', enum: EmailStatus })
  emailStatus: string;

  @Column({ type: 'enum', enum: EmailType })
  emailType: string;

  @Column({ type: 'varchar' })
  emailDetail: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  mrn: string;

  @Column({ type: 'varchar' })
  caseId: string;

  @Column({ type: 'varchar' })
  emailOpen: boolean;

  @Column({ type: 'varchar' })
  emailSent: string;

  @Column({ type: 'varchar' })
  linkOpen: boolean;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar' })
  subject: string;

  @Column({ type: 'varchar' })
  message: string;

  @Column({ type: 'varchar' })
  links: string;

  @Column({ type: 'varchar' })
  linksFull: string;

  @Column({ type: 'varchar' })
  signature: string;

  @Column({ type: 'varchar' })
  attachments: string;

  @Column({ type: 'varchar' })
  textBody: string;

  @Column({ type: 'enum', enum: TextStatus })
  textStatus: string;
}
