import { IsEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IBaseEntity } from './base.interface';

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

  @Column({ nullable: true, type: 'uuid' })
  createdBy?: string;

  @Column({ nullable: true, type: 'uuid' })
  updatedBy?: string;

  @Column({ nullable: true, type: 'uuid' })
  deletedBy?: string;
}
