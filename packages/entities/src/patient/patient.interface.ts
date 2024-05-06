import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';
import { IReferrer } from '../referrer';

export interface IPatient extends IBaseEntity {
  practice: IPractice;
  mrn: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  pcp?: string;
  referrer?: IReferrer;
  details?: string;
}
