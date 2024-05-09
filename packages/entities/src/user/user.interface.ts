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
  status: UserStatus;
  type: UserType;
  contactNumber: string;
  practiceId?: string;
  practices: IPractice[];
  permissions: IPermission[];
  permissionIds?: string[];
  surgeries: ISurgery[];
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
export interface ISanitizedUser extends IBaseEntity {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  url: string;
  status: UserStatus;
  type: UserType;
  contactNumber: string;
  practices: IPractice[];
  permissions: IPermission[];
  surgeries: ISurgery[];
}
