import { ReviewStatus } from '@packages/entities/index.browser';

export interface Review {
  practiceId: string;
  practiceName: string;
  patientId: string;
  patientName: string;
  MRN: string;
  reviewStatus: ReviewStatus;
  reviewDate: Date;
  reviewComment: string;
  source: string;
  emailOpened: boolean;
}

export interface AddReview {
  practiceId: string;
  patientId: string;
  reviewStatus: ReviewStatus;
  reviewDate: Date;
  reviewComment: string;
  source: string;
  emailOpened: boolean;
}

export interface EditReview {
  practiceId: string;
  patientId: string;
  reviewStatus: ReviewStatus;
  reviewDate: Date;
  reviewComment: string;
  source: string;
  emailOpened: boolean;
}
