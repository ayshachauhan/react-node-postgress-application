import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice/practice.interface';
import { SurgeryConfigurationEntity } from '../surgeryConfiguration';
import { ISurgeryType } from '../surgeryType';
import { ISanitizedUser } from '../user';

export interface ICalendar extends IBaseEntity {
  practice: IPractice;
  surgeryType: ISurgeryType;
  user: ISanitizedUser;
  date: Date;
  bookedSlots: number;
  bookedHours: string;
  maxSlots: number;
  surgeryConfiguration: SurgeryConfigurationEntity;
}
