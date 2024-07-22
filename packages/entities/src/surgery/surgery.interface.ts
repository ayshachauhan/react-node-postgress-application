import { IBaseEntity } from '../base.interface';
import { IPractice, ISurgeryConfiguration, IWaitlist } from '../index.browser';
import { IInsuranceType } from '../insuranceType';
import { IPatient } from '../patient';
import { IPracticeHomes } from '../practiceHomes';
import { ISanitizedUser } from '../user';
export interface ISurgery extends IBaseEntity {
  practiceHome: IPracticeHomes;
  surgeryConfiguration: ISurgeryConfiguration;
  patient: IPatient;
  insuranceType: IInsuranceType;
  insuranceDetails: string;
  notes: string;
  date: Date;
  doctor: ISanitizedUser;
  bodyPart: string;
  selectedSurgeryOptions: SelectedSurgeryOption;
  totalHospitalPricing: string;
  totalProfessionalPricing: string;
  selectedCheckListOptions: CheckListOptions;
  waitlist: IWaitlist;
  dateDeleted?: Date;
  surgeryOrder: number;
  surgeryStatus: SurgeryStatus;
  selectedConditionalOptions: SelectedConditionalOption;
  practice: IPractice; //TO DO: make practice id not null in future
  identifier?: string;
  count?: number;
  initialProfPrice?: string;
  initialHospitalPrice?: string;
}

export interface CreateSurgeryPayload {
  practiceId: string;
  surgeryConfigurationId: string;
  practiceHomeId: string;
  insuranceTypeId?: string;
  insuranceDetails?: string;
  notes?: string;
  date: Date;
  mrn: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pcp?: string;
  referrerId?: string;
  bodyPart: string;
  doctorId: string;
  selectedSurgeryOptions: SelectedSurgeryOption;
  totalHospitalPricing: string;
  totalProfessionalPricing: string;
  selectedCheckListOptions?: CheckListOptions;
  waitlistId?: string;
  identifier?: string;
  count?: number;
  initialProfPrice?: string;
  initialHospitalPrice?: string;
}

export interface SelectedSurgeryOption {
  [key: string]: {
    professionalPricing: number;
    hospitalPricing: number;
    value: string;
  };
}

export interface SelectedConditionalOption {
  [key: string]: {
    value: string;
  };
}

export interface CheckListOptions {
  [ket: string]: {
    value: string;
  };
}

export interface UpdateSurgeryPayload {
  practiceId?: string;
  insuranceTypeId?: string;
  date: Date;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  mrn: number;
  bodyPart: string;
  notes?: string;
  surgeryStatus: SurgeryStatus;
  selectedSurgeryOptions: SelectedSurgeryOption;
  selectedCheckListOptions?: CheckListOptions;
  totalHospitalPricing: string;
  totalProfessionalPricing: string;
  waitlistId?: string;
  surgeryOrder?: number;
  referrerId?: string;
  practiceHomeId: string;
  selectedConditionalOptions?: SelectedConditionalOption;
  initialProfPrice?: string;
  initialHospitalPrice?: string;
}

export interface MonthOption {
  label: string;
  value: string;
  id: string;
}

export enum SurgeryStatus {
  BOOK = 'BOOK',
  PENDING = 'PENDING',
  DATE_CHANGE = 'DATE_CHANGE',
  POSTPONE = 'POSTPONE',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  CONFIRMED = 'CONFIRMED',
}
