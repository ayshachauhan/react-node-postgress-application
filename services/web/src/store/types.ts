import {
  GetTemplatesResponse,
  IEval,
  IInsuranceType,
  IPermission,
  IPracticeHomes,
  IReferrer,
  ISurgery,
  ISurgeryConfiguration,
  ISurgeryType,
  IUser,
  IReview,
} from '@packages/entities/index.browser';
import { PracticesGetInterface } from 'src/store/requests/practices';
import { GetUserResponse } from './requests/login/types';

export enum EntityLoadingState {
  IDLE = 'idle',
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export type EntitiesState<T> = {
  entities: Record<string, T>;
  errorMessage?: string;
  processing: boolean;
  successMessage?: string;
  status: EntityLoadingState;
};

export type AuthState = Omit<EntitiesState<IUser>, 'entities'> & {
  user: GetUserResponse | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  azentiaSelectedPractice?: string;
};

export type InsuranceTypeState = EntitiesState<IInsuranceType> & {
  insuranceTypeInfo: IInsuranceType | null;
};

export type SurgeryTypeState = EntitiesState<ISurgeryType> & {
  surgeryTypeInfo: ISurgeryType | null;
};

export type EvalState = EntitiesState<IEval> & {
  evalInfo: IEval | null;
};

export type SurgeryState = EntitiesState<ISurgery> & {
  surgeryInfo: ISurgery | null;
};

export type SurgeryConfigurationState = EntitiesState<ISurgeryConfiguration> & {
  surgeryConfigurationInfo: ISurgeryConfiguration | null;
};

export type PracticeHomeState = EntitiesState<IPracticeHomes>;

export type PracticeState = EntitiesState<PracticesGetInterface> & {
  practiceInfo: PracticesGetInterface | null;
};

export type SanitizedUser = Omit<IUser, 'password'>;

export type UserState = EntitiesState<SanitizedUser> & {
  userInfo: SanitizedUser | null;
};

export type ReferrerState = EntitiesState<IReferrer> & {
  referrerInfo: IReferrer | null;
};

export type TemplateState = EntitiesState<GetTemplatesResponse> & {
  templateInfo: GetTemplatesResponse | null;
};

export type PermissionState = EntitiesState<IPermission> & {
  permissionInfo: IPermission | null;
};

export type ReviewState = EntitiesState<IReview> & {
  reviewInfo: IReview | null;
};