import { IBaseEntity } from '../base.interface';

export interface IReferrer extends IBaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  practiceId: string;
  referrerType: ReferrerType;
}

export enum ReferrerType {
  PCP = 'PCP',
  OPHTHO = 'Ophtho',
  OPTOM = 'Optom',
  SPECIALIST = 'Specialist',
}
