import { IBaseEntity } from '../base.interface';
import { IEval } from '../eval';
import { ISurgery } from '../surgery';

export interface IReferrer extends IBaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  practiceId: string;
  referrerType: ReferrerType | undefined;
  surgeries: ISurgery[];
  evals: IEval[];
  pcpSurgeries: ISurgery[];
  pcpEvals: IEval[];
  verified: boolean;
}

export enum ReferrerType {
  PCP = 'PCP',
  OPHTHO = 'Ophtho',
  OPTOM = 'Optom',
  SPECIALIST = 'Specialist',
}
