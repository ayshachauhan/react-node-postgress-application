import { IPatient } from 'src/patient';
import { IBaseEntity } from '../base.interface';
import { IPractice } from 'src/practice';

export interface IReview extends IBaseEntity {
  patient: IPatient;
  practice: IPractice;
  reviewDate: Date;
  reviewComment: string;
  reviewStatus: ReviewStatus;
  source: string;
}

export enum ReviewStatus {
  PENDING = 'Pending',
  SENT = 'Sent',
  RECEIVED = 'Received',
  WAITING = 'Waiting',
  REJECTED = 'Rejected',
}
