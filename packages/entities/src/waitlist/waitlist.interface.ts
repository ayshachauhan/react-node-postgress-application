import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';

export interface IWaitlist extends IBaseEntity {
  name: string;
  practice: IPractice;
}

export interface CreateWaitlist {
  name: string;
  practiceId: string;
}
