import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { IsEmpty } from "class-validator";

export const CREATE = "CREATE";
export const UPDATE = "UPDATE";

@Entity()
@Entity("practices")
export class PracticeEntity {
  //  commenting this is unknown for the moment groups
  @IsEmpty({ groups: [CREATE, UPDATE] })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ nullable: false })
  dateCreated: Date;

  @UpdateDateColumn({ nullable: false })
  dateUpdated: Date;

  @DeleteDateColumn({ nullable: true, type: "timestamp", select: false })
  dateDeleted?: Date;

  @Column({ type: "varchar" })
  name: string;
}
