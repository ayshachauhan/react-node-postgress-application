export type UploadPatientImagesData = {
  practiceId: string;
  files: Express.Multer.File[];
  id: string;
};
