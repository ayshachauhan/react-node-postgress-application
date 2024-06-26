import { ReviewStatus } from '@packages/entities/index.browser';

export interface Review {
  practiceId: string;
  practiceName: string;
  patientId: string;
  patientName: string;
  MRN: string;
  reviewStatus: ReviewStatus;
  reviewPostDate: Date;
  reviewRequestDate: Date;
  reviewComment: string;
  source: string;
  emailOpened: boolean;
}

export interface AddReview {
  practiceId: string;
  patientId: string;
  reviewStatus: ReviewStatus;
  reviewRequestDate: Date;
  reviewPostDate: Date;
  reviewComment: string;
  source: string;
  emailOpened: boolean;
}

export interface EditReview {
  id: string;
  practiceId: string;
  reviewStatus: ReviewStatus;
  reviewRequestDate: Date;
  reviewPostDate: Date;
  reviewComment: string;
  source: string;
  emailOpened: boolean;
}

export interface SendReview {
  id: string;
  practiceId: string;
}
