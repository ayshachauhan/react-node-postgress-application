import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PracticeEntity } from './practices.entity';
import { Meridian } from 'src/enums/meridian';

@Entity('templates')
export class TemplateEntity extends BaseEntity {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @Column({ type: 'number' })
  dateOffset: number;

  @Column({
    type: 'enum',
    enum: Meridian,
    default: null,
    nullable: true,
  })
  meridiem?: Meridian;

  @Column({ type: 'varchar' })
  emailSubject: string;

  @Column({ type: 'varchar' })
  emailBody: string;

  @Column({ type: 'varchar' })
  emailAttachment: string;

  @Column({ type: 'varchar' })
  textBody: string;
}
