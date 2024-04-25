import { IBaseEntity } from '../base.interface';
import { ISurgeryType } from '../surgeryType';

export interface IMedia extends IBaseEntity {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
  surgeryType: ISurgeryType;
}

export type IMediaRequest = {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
  surgeryTypeId: string;
};
