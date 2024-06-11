import { IBaseEntity } from '../base.interface';
import { IMediaConfig } from '../mediaConfig/mediaConfig.interface';

export interface IMedia extends IBaseEntity {
  practiceId: string;
  mediaType: MediaType;
  entityId: string | null;
  mediaConfigs: IMediaConfig[];
}

export enum MediaType {
  PRACTICE = 'practice',
  PATIENT = 'patient',
}
