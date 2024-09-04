import { IBaseEntity } from '../base.interface';
import { IPatient } from '../patient';

export interface IChatbot extends IBaseEntity {
    userQuestion: string;
    botReply: string;
    patient: IPatient;
}
