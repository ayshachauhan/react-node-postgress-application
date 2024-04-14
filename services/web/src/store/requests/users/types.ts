import { UserStatus, UserType } from '@packages/entities/user';

export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  fullName: string;
  email: string;
  url: string;
  status: UserStatus;
  type: UserType;
  userPractices: UserPractice[];
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

export interface AddUser {
  userName: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  fullName: string;
  email: string;
  url: string;
  status: UserStatus;
  type: UserType;
  practiceId: string;
}

export interface EditUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  fullName: string;
  email: string;
  url: string;
  status: UserStatus;
  type: UserType;
  practiceId: string;
}

export interface ChangePasswordInterface {
  email: string;
  oldPassword: string;
  confirmPassword: string;
  newPassword: string;
  practiceId: string;
}
