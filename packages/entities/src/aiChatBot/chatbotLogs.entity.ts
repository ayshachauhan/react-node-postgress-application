import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IChatbot, QuestionAnswers } from './chatbotLogs.interface';
import { IPatient, PatientEntity } from '../patient';

@Entity('chatbotlogs')
export class ChatbotLogsEntity extends BaseEntity implements IChatbot {
    @Column({ type: 'jsonb', nullable: true })
    botQuestionAnswers: QuestionAnswers[];

    @ManyToOne(() => PatientEntity)
    @JoinColumn({ name: 'patientId' })
    patient: IPatient | null;

    @Column({ type: 'varchar' })
    assistantChatThreadId: string;

    @Column({ type: 'varchar' })
    userIdentifier:string;

    @Column({ type: 'varchar' })
    assistantId: string;
}
