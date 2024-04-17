import { IUser } from '.';
import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';

export interface IUserPractice extends IBaseEntity {
  user: IUser;
  practice: IPractice;
}
