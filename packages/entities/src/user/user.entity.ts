import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PermissionEntity } from '../permission/permission.entity';
import { PracticeEntity } from '../practice/practice.entity';
import { SurgeryEntity } from '../surgery';
import { IUser, UserStatus, UserType } from './user.interface';

@Entity('users')
export class UserEntity extends BaseEntity implements IUser {
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  userName: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'varchar' })
  url: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.EMPLOYEE,
  })
  type: UserType;

  @Column({ type: 'varchar' })
  contactNumber: string;

  @ManyToMany(() => PracticeEntity)
  @JoinTable({
    name: 'user_practices',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'practiceId', referencedColumnName: 'id' },
  })
  practices: PracticeEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];

  @OneToMany(() => SurgeryEntity, (surgery) => surgery.doctor)
  surgeries: SurgeryEntity[];

  @Column({ type: 'varchar', nullable: true })
  imgUrl?: string;
}
