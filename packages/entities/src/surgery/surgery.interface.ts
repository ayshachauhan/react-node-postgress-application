import { IBaseEntity } from '../base.interface';
import { IInsuranceType } from '../insuranceType';
import { IPatient } from '../patient';
import { IPracticeHomes } from '../practiceHomes';
import { ISurgeryType } from '../surgeryType';
import { ISanitizedUser } from '../user';
export interface ISurgery extends IBaseEntity {
  practiceHome: IPracticeHomes;
  surgeryType: ISurgeryType;
  patient: IPatient;
  insuranceType: IInsuranceType;
  insuranceDetails: string;
  date: Date;
  eye: string;
  doctor: ISanitizedUser;
  lensType: string;
}

export enum ProcedureStatus {
  BOOKED = 'Booked',
  INPROGRESS = 'In progress',
  COMPLETE = 'Complete',
}
