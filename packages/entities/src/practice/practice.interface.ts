import { BaseEntity } from '../base.entity';
import { IUser } from '../user/user.interface';

export interface IPractice extends BaseEntity {
  name: string;
  code: string;
  status: PracticeStatus;
  photoUrl: string;
  users: IUser[];
}

export enum PracticeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
