import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { PermissionEntity } from './permissions.entity';
import { PracticeEntity } from './practices.entity';

@Entity('user_permissions')
export class UserPermission {
  @OneToOne(() => PracticeEntity)
  @JoinColumn({ name: 'practiceId' })
  practice: 'practiceId';

  @OneToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permissionId' })
  permission: 'permssionId';
}
