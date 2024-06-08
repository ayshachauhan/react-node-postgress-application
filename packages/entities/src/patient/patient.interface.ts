import { IBaseEntity } from '../base.interface';
import { IEval } from '../eval';
import { IPractice } from '../practice';
import { IReferrer } from '../referrer';
import { ISurgery } from '../surgery';

export interface IPatient extends IBaseEntity {
  practice: IPractice;
  mrn: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  pcp?: string;
  referrer?: IReferrer;
  details?: string;
  surgeries?: ISurgery[];
  evals?: IEval[];
}
