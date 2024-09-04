import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { IChatbot } from './chatbotLogs.interface';
import { IPatient, PatientEntity } from '../patient';

@Entity('chatbotlogs')
export class ChatbotLogsEntity extends BaseEntity implements IChatbot {
    @Column({ type: 'varchar' })
    userQuestion: string;

    @Column({ type: 'varchar' })
    botReply: string;

    @ManyToOne(() => PatientEntity)
    @JoinColumn({ name: 'patientId' })
    patient: IPatient;
}
