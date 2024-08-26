import { IBaseEntity } from '../base.interface';
import { IPatient } from '../patient';

export interface IReferrer extends IBaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  practiceId: string;
  referrerType: ReferrerType | undefined;
  patients: IPatient[];
  patientsByPcp: IPatient[];
  verified: boolean;
}

export enum ReferrerType {
  PCP = 'PCP',
  OPHTHO = 'Ophtho',
  OPTOM = 'Optom',
  SPECIALIST = 'Specialist',
}
