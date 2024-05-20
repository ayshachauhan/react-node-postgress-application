import { IPermission } from '@packages/entities';
import { IPractice } from '@packages/entities/index.browser';

export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  fullName: string;
  url: string;
  status: string;
  type: string;
  email: string;
  isSuperAdmin: string;
  userPractices: UserPractice[];
}

export interface GetUserResponse {
  id?: string;
  userName: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  fullName: string;
  url: string;
  status: string;
  type: string;
  email: string;
  isSuperAdmin: string;
  userPractices: UserPractice[];
  practices?: IPractice[];
  permissions?: IPermission[];
}

export interface UserPractice {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  practice: Practice;
}

export interface Practice {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  name: string;
}
