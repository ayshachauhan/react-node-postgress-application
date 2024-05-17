import { IBaseEntity } from '../base.interface';
import { IInsuranceType } from '../insuranceType';
import { IPatient } from '../patient';
import { IPracticeHomes } from '../practiceHomes';
import { ISurgeryConfiguration } from '../surgeryConfiguration';
import { ISanitizedUser } from '../user';
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
}
