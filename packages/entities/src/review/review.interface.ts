import { IBaseEntity } from '../base.interface';

export interface IReview extends IBaseEntity {
  patientId: string;
  MRN: string;
  email: string;
  practiceId: string;
  reviewDate: Date;
  reviewComment: string;
  reviewStatus: ReviewStatus;
}

export enum ReviewStatus {
  PENDING = 'Pending',
  SENT = 'Sent',
  RECEIVED = 'Received',
  WAITING = 'Waiting',
  REJECTED = 'Rejected',
}
