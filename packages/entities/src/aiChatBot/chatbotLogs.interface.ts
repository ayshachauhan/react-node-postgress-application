import { IBaseEntity } from '../base.interface';
import { IPatient } from '../patient';
import { IPractice } from '../practice';

export interface IChatbot extends IBaseEntity {
  botQuestionAnswers: QuestionAnswers[];
  patient: IPatient | null;
  assistantChatThreadId: string;
  userIdentifier: string;
  assistantId: string;
  practice: IPractice | null;
}

export type QuestionAnswers = {
  [key: string]: string;
};
