import { BaseEntity } from '../base.entity';
import { IPractice } from '../practice';

export interface IInsuranceType extends BaseEntity {
  name: string;
  practice: IPractice;
}
