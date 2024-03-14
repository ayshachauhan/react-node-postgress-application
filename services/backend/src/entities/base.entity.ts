import { IsEmpty } from 'class-validator';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export const CREATE = 'CREATE';

export abstract class BaseEntity {
  @IsEmpty({ groups: [CREATE] })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ nullable: false })
  dateCreated: Date;

  @UpdateDateColumn({ nullable: false })
  dateUpdated: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamp', select: false })
  dateDeleted?: Date;
}
