import { IBaseEntity } from '../base.interface';
import { ISurgeryType } from '../surgeryType';
import { ISanitizedUser } from '../user';

export interface ICalendar extends IBaseEntity {
  surgeryType: ISurgeryType;
  user: ISanitizedUser;
  date: Date;
  availableSlots: number;
  maxSlots: number;
}
