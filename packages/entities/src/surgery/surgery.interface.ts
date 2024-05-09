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
  eye: string;
  doctor: ISanitizedUser;
  surgeryOption: string[];
}

export interface CreateSurgeryPayload {
  practiceId: string;
  surgeryConfigurationId: string;
  practiceHomeId: string;
  insuranceTypeId?: string;
  insuranceDetails?: string;
  date: Date;
  mrn: string;
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
}

export interface SelectedSurgeryOption {
  [key: string]: {
    professionalPricing: number;
    hospitalPricing: number;
    value: string;
  };
}
