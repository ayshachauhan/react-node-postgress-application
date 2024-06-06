import { IBaseEntity } from '../base.interface';
import { IPermission } from '../permission';
import { IPractice } from '../practice';
import { ISurgery } from '../surgery';

export interface IUser extends IBaseEntity {
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  url: string;
  designation: string;
  status: UserStatus;
  type: UserType;
  contactNumber: string;
  practiceId?: string;
  practices: IPractice[];
  permissions: IPermission[];
  permissionIds?: string[];
  surgeries: ISurgery[];
  imgUrl?: string;
}

export enum UserType {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  EMPLOYEE = 'employee',
  PHYSICIAN = 'physician',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export type ISanitizedUser = Omit<IUser, 'password'>;
