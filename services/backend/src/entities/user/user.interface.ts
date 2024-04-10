import { BaseEntity } from '../base.entity';
import { IPractice } from '../practice';

export interface IUser extends BaseEntity {
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
  practices: IPractice[];
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
