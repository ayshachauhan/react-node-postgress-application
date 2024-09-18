import { Request } from 'express';
import { SanitizedUser } from '../auth/types';

export type PatientMailData = {
  practiceName?: string;
  firstName: string;
  email: string;
  mrn: number;
  phoneNumber: string;
  countryCode: string;
  lastName: string;
  date: string;
  practiceHome?: string;
  surgeryType?: string;
  insuranceType?: string;
  insuranceDetails?: string;
};

export type AuthenticatedRequest = Request & { user: SanitizedUser };

export type DeleteEvalData = {
  ipAddress: string;
  user: SanitizedUser;
  practiceId: string;
  id: string;
};
