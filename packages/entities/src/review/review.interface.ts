import { IBaseEntity } from '../base.interface';
import { IPatient } from '../patient';
import { IPractice } from '../practice';

export interface IReview extends IBaseEntity {
  patient: IPatient;
  practice: IPractice;
  reviewPostDate: Date;
  reviewRequestDate: Date;
  reviewComment: string;
  reviewStatus: ReviewStatus;
  source: string;
  emailOpened: boolean;
  userRating: string;
  practiceResponseDate: Date;
  practiceResponse: string;
  tags: string;
}

export interface ValidateReviewRequest {
  practiceId: string;
  token: string;
}

export interface PostUserReview extends ValidateReviewRequest {
  rating: string;
  reviewComment: string;
}

export enum ReviewStatus {
  PENDING = 'Pending',
  SENT = 'Sent',
  RECEIVED = 'Received',
  WAITING = 'Waiting',
  REJECTED = 'Rejected',
}
