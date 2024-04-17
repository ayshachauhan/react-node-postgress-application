import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IPermission } from './permission.interface';

@Entity('permissions')
export class PermissionEntity extends BaseEntity implements IPermission {
  @Column({ type: 'varchar' })
  name: string;
}
