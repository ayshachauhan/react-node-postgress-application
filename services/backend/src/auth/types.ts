import { UserEntity } from '@packages/entities/user';

export type SanitizedUser = Omit<UserEntity, 'password'> & {
  isSuperAdmin: false;
};

export type SuperAdminUser = {
  email: string;
  isSuperAdmin: true;
};
