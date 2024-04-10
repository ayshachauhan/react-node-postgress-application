import { BaseEntity } from '../base.entity';
import { IPermission } from '../permission';
import { IUser } from './user.interface';

export interface IUserPermission extends BaseEntity {
  user: IUser;
  permission: IPermission;
}
