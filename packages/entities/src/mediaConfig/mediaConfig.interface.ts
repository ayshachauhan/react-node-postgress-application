import { IBaseEntity } from '../base.interface';

export enum MediaConfigType {
  VIDEO = 'video',
  IMAGE = 'image',
}

export interface IMediaConfig extends IBaseEntity {
  mediaId: string;
  configType: MediaConfigType;
  title: string;
  url: string;
}
