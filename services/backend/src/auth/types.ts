import { User } from '@packages/entities/user';

export type SanitizedUser = Omit<User, 'password'> & {
  isSuperAdmin: false;
};

export type SuperAdminUser = {
  email: string;
  isSuperAdmin: true;
};
