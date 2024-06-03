import { MediaConfig, MediaType } from '@packages/entities/index.browser';

export type AddMediaDTO = {
  practiceId: string;
  mediaType: MediaType;
  mediaConfig: MediaConfig;
};

export type UploadImgPayload = {
  practiceId: string;
  mediaId: string;
  files: {
    title: string;
    file: File | null;
  }[];
};
