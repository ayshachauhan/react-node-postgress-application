import { IsEmpty } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity } from './base.interface';
import { UserEntity } from './user/user.entity';

export const CREATE = 'CREATE';

export abstract class BaseEntity implements IBaseEntity {
  @IsEmpty({ groups: [CREATE] })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ nullable: false })
  dateCreated: Date;

  @UpdateDateColumn({ nullable: false })
  dateUpdated: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamp', select: false })
  dateDeleted?: Date;

  @ManyToOne(() => UserEntity, { nullable: true })
  createdBy?: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  updatedBy?: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  deletedBy?: string;
}
