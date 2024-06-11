import { MediaConfigType } from '@packages/entities';

export type UploadPatientImagesData = {
  practiceId: string;
  files: Express.Multer.File[];
  id: string;
};

export type MediaConfigDTO = {
  title: string;
  url: string;
  configType: MediaConfigType;
};
