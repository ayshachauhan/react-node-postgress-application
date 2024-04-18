import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';
export interface IPatient extends IBaseEntity {
  practice: IPractice;
  mrn: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  pcp?: string;
  referrer?: string;
}
