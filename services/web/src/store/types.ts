import {
  GetTemplatesResponse,
  IInsuranceType,
  IPracticeHomes,
  IReferrer,
} from '@packages/entities';
import { IUser } from '@packages/entities/index.browser';
import { GetUserResponse } from './requests/login/types';
import { PracticesGetInterface } from './requests/practices';

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
