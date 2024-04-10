import { IUser } from '.';
import { BaseEntity } from '../base.entity';
import { IPractice } from '../practice';

export interface IUserPractice extends BaseEntity {
  user: IUser;
  practice: IPractice;
}
