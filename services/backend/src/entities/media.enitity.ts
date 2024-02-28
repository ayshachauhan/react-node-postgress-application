import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column } from 'typeorm';
import { IsEmpty } from 'class-validator';

@Entity('videos')
export class Video {
   @IsEmpty({ groups: ['CREATE'] })
   @PrimaryGeneratedColumn('uuid')
   id: string;
  
  @Column({ type: 'uuid' }) 
  practiceId: string;   

  @Column({ type: 'varchar' })
  name: string;
  
  @Column({ type: 'varchar' })
  urlEmbed: string;
  
  @Column({ type: 'varchar' })
  url: string;
  
  @CreateDateColumn({ nullable: false })
  dateCreated: Date;

  @UpdateDateColumn({ nullable: false })
  dateUpdated: Date;

  @DeleteDateColumn({ nullable: true, type: 'timestamp', select: false })
  dateDeleted?: Date;
  
}
