import { IBaseEntity } from '../base.interface';
import { IInsuranceType } from '../insuranceType';
import { IPatient } from '../patient';
import { IPractice } from '../practice';
import { IPracticeHomes } from '../practiceHomes';
import { IReferrer } from '../referrer';
import { ISurgeryConfiguration } from '../surgeryConfiguration';
import { ISanitizedUser } from '../user';
import { IWaitlist } from '../waitlist';
export interface IEval extends IBaseEntity {
  practiceHome: IPracticeHomes;
  surgeryConfiguration: ISurgeryConfiguration;
  patient: IPatient;
  insuranceType: IInsuranceType;
  insuranceDetails: string;
  notes: string;
  date: Date;
  status: string;
  bodyPart: string;
  doctor: ISanitizedUser;
  waitlist: IWaitlist;
  practice: IPractice; //TO DO: make practice id not null in future
  pcp?: IReferrer;
  referrer?: IReferrer;
  slot: string;
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
  countryCode: string;
  phoneNumber: string;
  pcp?: string;
  referrerId?: string;
  notes?: string;
  status: string;
  bodyPart: string;
  doctorId: string;
  waitlistId?: string;
  slot: string;
}

export interface UpdateEValInterface {
  practiceId?: string;
  insuranceTypeId?: string;
  date: Date;
  firstName: string;
  lastName: string;
  mrn: number;
  bodyPart: string;
  notes?: string;
  insuranceDetails?: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  status: string;
  referrerId?: string;
  waitlistId?: string;
  practiceHomeId: string;
  pcp?: string;
  slot: string;
}
