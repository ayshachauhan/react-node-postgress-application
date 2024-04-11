export interface PracticesGetInterface {
  id?: string;
  name: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminEmail?: string;
  adminContactNumber?: string;
  status: string;
  code: string;
  dateCreated?: string;
  dateUpdated?: string;
}

export type CreatePracticeInviteMailData = {
  signUpLink: string;
  practiceName: string;
  userFirstName: string;
  userLastName: string;
  contactEmail: string;
  contactPhone: string;
};
