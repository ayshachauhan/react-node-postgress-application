import { IBaseEntity } from '../base.interface';
import { IInsuranceType } from '../insuranceType';
import { IPatient } from '../patient';
import { IPracticeHomes } from '../practiceHomes';
import { ISurgeryType } from '../surgeryType';
import { ISanitizedUser } from '../user';
export interface IEval extends IBaseEntity {
  practiceHome: IPracticeHomes;
  surgeryType: ISurgeryType;
  patient: IPatient;
  insuranceType: IInsuranceType;
  insuranceDetails: string;
  date: Date;
  status: string;
  eye: string;
  doctor: ISanitizedUser;
}
