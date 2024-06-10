import { IsEmpty } from 'class-validator';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EmailLogEntity } from '../emailLogs/emailLogs.entity';
import { EvalEntity } from '../eval/eval.entity';
import { IEvalEmail } from './evalEmail.interface';

@Entity('eval_emails')
export class EvalEmailEntity implements IEvalEmail {
  @IsEmpty({ groups: ['CREATE'] })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => EvalEntity)
  @JoinColumn({ name: 'evalId' })
  eval: EvalEntity;

  @ManyToOne(() => EmailLogEntity)
  @JoinColumn({ name: 'emailLogId' })
  emailLog: EmailLogEntity;
}
