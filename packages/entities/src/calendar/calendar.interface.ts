import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice/practice.interface';
import { ISurgeryType } from '../surgeryType';
import { ISanitizedUser } from '../user';

export interface ICalendar extends IBaseEntity {
  practice: IPractice;
  surgeryType: ISurgeryType;
  user: ISanitizedUser;
  date: Date;
  availableSlots: number;
  maxSlots: number;
}
