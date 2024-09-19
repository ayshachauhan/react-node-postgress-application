import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { PatientEntity } from '../patient';
import { PracticeEntity } from '../practice';
import { IChatbot, QuestionAnswers } from './chatbotLogs.interface';

@Entity('chatbotlogs')
export class ChatbotLogsEntity extends BaseEntity implements IChatbot {
  @Column({ type: 'jsonb', nullable: true })
  botQuestionAnswers: QuestionAnswers[];

  @ManyToOne(() => PatientEntity, { nullable: true })
  @JoinColumn({ name: 'patientId' })
  patient: PatientEntity | null;

  @Column({ type: 'varchar' })
  assistantChatThreadId: string;

  @Column({ type: 'varchar' })
  userIdentifier: string;

  @Column({ type: 'varchar' })
  assistantId: string;

  @ManyToOne(() => PracticeEntity, { nullable: true })
  @JoinColumn({ name: 'practiceId' })
  practice: PracticeEntity | null;
}
