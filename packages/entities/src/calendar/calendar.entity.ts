import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { SurgeryConfigurationEntity } from '../surgeryConfiguration';
import { SurgeryTypeEntity } from '../surgeryType';
import { UserEntity } from '../user';
import { ICalendar } from './calendar.interface';
@Entity('calendars')
export class CalendarEntity extends BaseEntity implements ICalendar {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => SurgeryTypeEntity, { nullable: true })
  @JoinColumn({ name: 'surgeryTypeId' })
  surgeryType: SurgeryTypeEntity;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'integer' })
  bookedSlots: number;

  @Column({ type: 'integer', default: 14 })
  maxSlots: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => SurgeryConfigurationEntity, { nullable: true })
  @JoinColumn({ name: 'surgeryConfigurationId' })
  surgeryConfiguration: SurgeryConfigurationEntity;

  @Column({ type: 'numeric' })
  bookedHours: string;
}
