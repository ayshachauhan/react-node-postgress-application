import { UserStatus, UserType } from '@packages/entities/user';

export type SanitizedUser = {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
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
