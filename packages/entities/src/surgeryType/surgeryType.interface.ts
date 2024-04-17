import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';

export interface ISurgeryType extends IBaseEntity {
  practice: IPractice;
  name: string;
}
