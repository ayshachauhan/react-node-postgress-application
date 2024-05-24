import { IBaseEntity } from '../base.interface';
import { ISurgeryConfiguration } from '../index.browser';
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
  date: Date;
  doctor: ISanitizedUser;
  bodyPart: string;
  selectedSurgeryOptions: SelectedSurgeryOption;
  totalHospitalPricing: number;
  totalProfessionalPricing: number;
  selectedCheckListOptions: CheckListOptions;
  dateDeleted?: Date;
}

export interface CreateSurgeryPayload {
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
  bodyPart: string;
  doctorId: string;
  selectedSurgeryOptions: SelectedSurgeryOption;
  totalHospitalPricing: number;
  totalProfessionalPricing: number;
  selectedCheckListOptions?: CheckListOptions;
}

export interface SelectedSurgeryOption {
  [key: string]: {
    professionalPricing: number;
    hospitalPricing: number;
    value: string;
  };
}

export enum ProcedureStatus {
  BOOKED = 'Booked',
  INPROGRESS = 'In progress',
  COMPLETE = 'Complete',
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
  mrn: number;
  bodyPart: string;
  selectedSurgeryOptions: SelectedSurgeryOption;
  selectedCheckListOptions?: CheckListOptions;
  totalHospitalPricing: number;
  totalProfessionalPricing: number;
  details?: string;
}
