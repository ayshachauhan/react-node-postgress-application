import { Meridiem } from 'src/enums/meridian';
import { TemplateMessageType } from 'src/enums/templateMessageType.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PracticeEntity } from './practices.entity';
import { User } from './users.entity';

@Entity('templates')
export class TemplateEntity extends BaseEntity {
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

  @Column({ type: 'uuid', default: null, nullable: true })
  surgeryType: string;

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
