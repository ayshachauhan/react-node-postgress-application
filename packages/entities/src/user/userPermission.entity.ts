import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { UserEntity } from './user.entity';
import { IUserPermission } from './userPermission.interface';

@Entity('user_permissions')
export class UserPermissionEntity
  extends BaseEntity
  implements IUserPermission
{
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;
}
