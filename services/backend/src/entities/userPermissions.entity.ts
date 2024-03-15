import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { PermissionEntity } from './permissions.entity';
import { User } from './users.entity';

@Entity('user_permissions')
export class UserPermissionEntity extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permissionId' })
  permission: PermissionEntity;
}
