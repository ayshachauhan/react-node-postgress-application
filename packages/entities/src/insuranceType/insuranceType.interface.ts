import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';

export interface IInsuranceType extends IBaseEntity {
  name: string;
  practice: IPractice;
}

export interface CreateInsuranceTypeInterface {
  practiceId: string;
  name: string;
}
