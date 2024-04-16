import { ReferrerType } from '@root/enums/referrerType.enum';

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
  referrerType: ReferrerType;
  practiceId: string;
}
