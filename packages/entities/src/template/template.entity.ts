import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ITemplate, Meridiem, SurgeryType, TemplateMessageType } from '.';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { User } from '../user/user.entity';

@Entity('templates')
export class TemplateEntity extends BaseEntity implements ITemplate {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'surgeonId' })
  surgeon: User;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({
    type: 'enum',
    enum: TemplateMessageType,
    default: null,
    nullable: true,
  })
  messageType: TemplateMessageType;

  @Column({ type: 'integer' })
  dateOffset: number;

  @Column({
    type: 'enum',
    enum: Meridiem,
    default: null,
    nullable: true,
  })
  meridiem?: Meridiem;

  @Column({ type: 'enum', enum: SurgeryType, default: null, nullable: true })
  surgeryType: SurgeryType;

  @Column({ type: 'varchar' })
  emailSubject: string;

  @Column({ type: 'varchar' })
  emailBody: string;

  @Column({ type: 'varchar' })
  emailAttachment: string;

  @Column({ type: 'varchar' })
  email1stCataract: string;

  @Column({ type: 'varchar' })
  email2ndCataract: string;

  @Column({ type: 'varchar' })
  messageText: string;

  @Column({ type: 'varchar' })
  version: string;
}
