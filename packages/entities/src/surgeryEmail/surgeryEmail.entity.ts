import { IsEmpty } from 'class-validator';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailLogEntity } from '../emailLogs/emailLogs.entity';
import { SurgeryEntity } from '../surgery/surgery.entity';
import { ISurgeryEmail } from './surgeryEmail.interface';

@Entity('surgery_emails')
export class SurgeryEmailEntity implements ISurgeryEmail {
  @IsEmpty({ groups: ['CREATE'] })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SurgeryEntity)
  @JoinColumn({ name: 'surgeryId' })
  surgery: SurgeryEntity;

  @ManyToOne(() => EmailLogEntity)
  @JoinColumn({ name: 'emailLogId' })
  emailLog: EmailLogEntity;
}
