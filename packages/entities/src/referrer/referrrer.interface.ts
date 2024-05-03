import { IBaseEntity } from '../base.interface';
import { ReferredPatient } from '../patient';

export interface IReferrer extends IBaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  practiceId: string;
  referrerType: ReferrerType;
  patients: ReferredPatient[];
}

export enum ReferrerType {
  PCP = 'PCP',
  OPHTHO = 'Ophtho',
  OPTOM = 'Optom',
  SPECIALIST = 'Specialist',
}
