import { IBaseEntity } from '../base.interface';
import { IPermission } from '../permission';
import { IUser } from './user.interface';

export interface IUserPermission extends IBaseEntity {
  user: IUser;
  permission: IPermission;
}
