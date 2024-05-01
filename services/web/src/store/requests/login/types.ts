import { IPractice } from '@packages/entities';

export interface User {
  statusCode: number;
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
