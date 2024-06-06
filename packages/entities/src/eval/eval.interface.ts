import { IBaseEntity } from '../base.interface';
import { IInsuranceType } from '../insuranceType';
import { IPatient } from '../patient';
import { IPracticeHomes } from '../practiceHomes';
import { ISurgeryConfiguration } from '../surgeryConfiguration';
import { ISanitizedUser } from '../user';
import { IWaitlist } from '../waitlist';
export interface IEval extends IBaseEntity {
  practiceHome: IPracticeHomes;
  surgeryConfiguration: ISurgeryConfiguration;
  patient: IPatient;
  insuranceType: IInsuranceType;
  insuranceDetails: string;
  date: Date;
  status: string;
  bodyPart: string;
  doctor: ISanitizedUser;
  waitlist: IWaitlist;
}

export interface CreateEvalInterface {
  practiceId: string;
  surgeryConfigurationId: string;
  practiceHomeId: string;
  insuranceTypeId?: string;
  insuranceDetails?: string;
  date: Date;
  mrn: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pcp?: string;
  referrerId?: string;
  details?: string;
  status: string;
  bodyPart: string;
  doctorId: string;
  waitlistId?: string;
}

export interface UpdateEValInterface {
  practiceId?: string;
  insuranceTypeId?: string;
  date: Date;
  firstName: string;
  lastName: string;
  mrn: number;
  bodyPart: string;
  details?: string;
  insuranceDetails?: string;
  email: string;
  phoneNumber: string;
  status: string;
}
