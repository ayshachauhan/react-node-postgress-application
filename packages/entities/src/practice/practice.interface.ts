import { IBaseEntity } from '../base.interface';
import { IUser } from '../user/user.interface';

export interface IPractice extends IBaseEntity {
  name: string;
  code: string;
  status: PracticeStatus;
  photoUrl?: string;
  users: IUser[];
}

export enum PracticeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
