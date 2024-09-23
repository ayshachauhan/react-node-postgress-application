import { IBaseEntity } from '../base.interface';
import { IUser } from '../user/user.interface';

export interface IPractice extends IBaseEntity {
  name: string;
  code: string;
  status: PracticeStatus;
  imgUrl?: string;
  users: IUser[];
  emailData: PracticeEmailData;
  assistantId: string;
}

export type PracticeEmailData = {
  [key: string]: string[];
};

export enum PracticeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}
