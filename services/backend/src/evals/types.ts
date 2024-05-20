import { Request } from 'express';
import { SanitizedUser } from 'src/auth/types';

export type PatientMailData = {
  practiceName?: string;
  firstName: string;
  email: string;
  mrn: number;
  phoneNumber: string;
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
