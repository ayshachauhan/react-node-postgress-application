import { UserStatus, UserType } from '@packages/entities/user';
import 'multer';

export type SanitizedUser = {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  designation: string;
  status: UserStatus;
  type: UserType;
  url: string;
  id: string;
  dateCreated: Date;
  dateUpdated: Date;
  dateDeleted?: Date | undefined;
};

export type NewUserMailData = {
  signUpLink: string;
  practiceName: string;
  fullName: string;
  defaultUserPassword: string;
};

export enum UploadType {
  USER = 'user',
  PRACTICE = 'practice',
}

export type GetUploadFileKey = {
  practiceId: string;
  file: Express.Multer.File;
  userId?: string;
};

export type UploadUserImgData = {
  practiceId: string;
  file: Express.Multer.File;
  id: string;
};
