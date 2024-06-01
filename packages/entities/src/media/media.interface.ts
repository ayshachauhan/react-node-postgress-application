import { IBaseEntity } from '../base.interface';
import { ISurgeryConfiguration } from '../surgeryConfiguration';

export interface IMedia extends IBaseEntity {
  practiceId: string;
  mediaType: MediaType;
  mediaConfig: MediaConfig;
}

export type IMediaRequest = {
  name: string;
  urlEmbed: string;
  url: string;
  practiceId: string;
  surgeryConfigurationId: string;
};

export enum MediaType {
  PRACTICE = 'practice',
  PATIENT = 'patient',
}

export type MediaConfig = PracticeMediaConfig | PatientMediaConfig;

export type Video = {
  title: string;
  url: string;
};

export type Image = {
  title: string;
  url: string;
};

export type PracticeMediaConfig = {
  surgeryConfiguration: ISurgeryConfiguration;
  video: Video[];
};

export type PatientMediaConfig = {
  mrn: number;
  video: Video[];
  image: Image[];
};
