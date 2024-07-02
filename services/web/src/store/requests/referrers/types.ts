import { ReferrerType } from '@packages/entities/index.browser';

export interface Referrer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  practiceId: string;
  referrerType: ReferrerType;
}

export interface AddReferrer {
  firstName: string;
  lastName: string;
  email: string;
  referrerType: ReferrerType | undefined;
  practiceId: string;
}

export interface EditReferrer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  referrerType: ReferrerType | undefined;
  practiceId: string;
}
