import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { User } from './user.entity';
import { IUserPermission } from './userPermission.interface';

@Entity('user_permissions')
export class UserPermissionEntity
  extends BaseEntity
  implements IUserPermission
{
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;
}
