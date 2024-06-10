import { IBaseEntity } from '../base.interface';

export interface IMedia extends IBaseEntity {
  practiceId: string;
  mediaType: MediaType;
  mediaConfig: MediaConfig;
}

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
  surgeryConfigurationId: string | null;
  video: Video[];
};

export type PatientMediaConfig = {
  patientId: string;
  video: Video[];
  image: Image[];
};
