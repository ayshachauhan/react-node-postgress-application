import { IUser, UserStatus, UserType } from '@packages/entities/index.browser';

export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  contactNumber: string;
  fullName: string;
  email: string;
  url: string;
  designation: string;
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
  countryCode: string;
  contactNumber: string;
  fullName: string;
  email: string;
  designation: string;
  url: string;
  type: UserType;
  practiceId: string;
}

export interface EditUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  contactNumber: string;
  designation: string;
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
  token?: string | null;
}

export type AddUserDto = Omit<
  IUser,
  | 'password'
  | 'practices'
  | 'id'
  | 'dateCreated'
  | 'dateUpdated'
  | 'permissions'
  | 'surgeries'
  | 'imgUrl'
> & {
  file: File | null;
};

export type UploadImgPayload = {
  id: string;
  practiceId: string;
  file: File;
};
