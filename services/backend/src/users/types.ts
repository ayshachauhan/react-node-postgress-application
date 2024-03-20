import { UserStatus } from 'src/enums/status.enum';
import { UserType } from 'src/enums/userType.enum';

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
