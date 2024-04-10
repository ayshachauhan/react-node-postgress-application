import { User } from '../entities/user/user.entity';

export type SanitizedUser = Omit<User, 'password'> & {
  isSuperAdmin: false;
};

export type SuperAdminUser = {
  email: string;
  isSuperAdmin: true;
};
