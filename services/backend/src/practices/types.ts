import { PracticeEmailData } from '@packages/entities';

export interface PracticesGetInterface {
  id?: string;
  name: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  adminContactNumber?: string;
  adminCountryCode?: string;
  adminId?: string;
  status: string;
  code: string;
  dateCreated?: string;
  dateUpdated?: string;
  imgUrl?: string;
  emailData: PracticeEmailData;
}

export type CreatePracticeInviteMailData = {
  signUpLink: string;
  practiceName: string;
  userFirstName: string;
  userLastName: string;
  contactEmail: string;
  contactPhone: string;
  countryCode: string;
};

export type UploadPracticeImgData = {
  file: Express.Multer.File;
  practiceId: string;
};
