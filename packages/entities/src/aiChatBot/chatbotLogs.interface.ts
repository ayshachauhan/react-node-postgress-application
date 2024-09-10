import { IBaseEntity } from '../base.interface';
import { IPatient } from '../patient';

export interface IChatbot extends IBaseEntity {
    botQuestionAnswers: QuestionAnswers[];
    patient: IPatient | null;
    assistantChatThreadId: string;
    userIdentifier:string;
    assistantId: string;
}

export type QuestionAnswers = {
    [key: string]: string;
};