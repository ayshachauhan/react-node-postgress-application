import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { SurgeryTypeEntity } from '../surgeryType';
import { User } from '../user';
import { ICalendar } from './calendar.interface';
@Entity('calendars')
export class CalendarEntity extends BaseEntity implements ICalendar {
  @ManyToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity;

  @ManyToOne(() => SurgeryTypeEntity)
  @JoinColumn({ name: 'surgeryTypeId' })
  surgeryType: SurgeryTypeEntity;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'integer' })
  availableSlots: number;

  @Column({ type: 'integer', default: 14 })
  maxSlots: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
