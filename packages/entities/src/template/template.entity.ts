import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { SurgeryConfigurationEntity } from '../surgeryConfiguration';
import { UserEntity } from '../user/user.entity';
import { ITemplate, Meridiem, TemplateMessageType } from './template.interface';

@Entity('templates')
export class TemplateEntity extends BaseEntity implements ITemplate {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'surgeonId' })
  surgeon: UserEntity;

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

  @ManyToOne(() => SurgeryConfigurationEntity)
  @JoinColumn({ name: 'surgeryConfigurationId' })
  surgeryConfiguration: SurgeryConfigurationEntity;

  @Column({ type: 'varchar', nullable: true })
  emailSubject: string;

  @Column({ type: 'varchar', nullable: true })
  emailBody: string;

  @Column({ type: 'varchar', nullable: true })
  emailAttachment: string;

  @Column({ type: 'varchar', nullable: true })
  email1stCataract: string;

  @Column({ type: 'varchar', nullable: true })
  email2ndCataract: string;

  @Column({ type: 'varchar', nullable: true })
  messageText: string;

  @Column({ type: 'varchar', nullable: true })
  version: string;
}
