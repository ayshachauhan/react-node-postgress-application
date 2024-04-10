export enum EntityLoadingState {
  IDLE = 'idle',
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export type EntitiesState<T> = {
  entities: Record<string, T>;
  errorMessage?: string;
  successMessage?: string;
  status: EntityLoadingState;
  processing: boolean;
};
