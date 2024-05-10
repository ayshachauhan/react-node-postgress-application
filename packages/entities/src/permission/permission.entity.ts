import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { UserEntity } from '../user/user.entity';
import { IPermission } from './permission.interface';

@Entity('permissions')
export class PermissionEntity extends BaseEntity implements IPermission {
  @Column({ type: 'varchar' })
  name: string;

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: { name: 'permissionId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  users: UserEntity[];
}
