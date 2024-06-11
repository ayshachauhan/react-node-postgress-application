import { MediaConfigType, MediaType } from '@packages/entities/index.browser';

export type AddMediaDTO = {
  practiceId: string;
  mediaType: MediaType;
  entityId: string | null;
  mediaConfig: MediaConfig | PatientMediaConfig;
};

export type PatientMediaConfig = {
  image?: BaseMediaConfig[];
  video?: BaseMediaConfig[];
};

export type BaseMediaConfig = {
  title: string;
  url?: string;
  file?: File | null;
};

export type MediaConfig = {
  title: string;
  url: string;
  file?: File;
  configType: MediaConfigType;
}[];

export type UploadImgPayload = {
  practiceId: string;
  mediaId: string;
  files: {
    title: string;
    file: File | null;
  }[];
};

export type DeleteMediaPayload = {
  practiceId: string;
} & DeleteMedia;

export enum DeleteMediaType {
  Media = 'media',
  MediaConfig = 'mediaconfig',
}

export type DeleteMedia = {
  mediaId?: string;
  type: DeleteMediaType;
  mediaConfigId?: string;
};
