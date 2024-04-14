import { IInsuranceType } from '@packages/entities';
import { IUser } from '@packages/entities/user';
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
