import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice/practice.interface';
import { ISurgeryConfiguration } from '../surgeryConfiguration/surgeryConfiguration.interface';
import { ISanitizedUser } from '../user';

export interface ICalendar extends IBaseEntity {
  practice: IPractice;
  surgeryConfiguration: ISurgeryConfiguration;
  user: ISanitizedUser;
  date: Date;
  bookedSlots: number;
  maxSlots: number;
}
