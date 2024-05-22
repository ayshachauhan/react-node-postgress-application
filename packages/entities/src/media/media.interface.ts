import { IBaseEntity } from '../base.interface';
import { ISurgeryConfiguration } from '../surgeryConfiguration';

export interface IMedia extends IBaseEntity {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
  surgeryConfiguration: ISurgeryConfiguration;
}

export type IMediaRequest = {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
  surgeryConfigurationId: string;
};
