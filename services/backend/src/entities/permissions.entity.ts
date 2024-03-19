import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('permissions')
export class PermissionEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;
}
