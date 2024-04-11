export interface PracticeCreateInterface {
  name: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminContactNumber: string;
  code: string;
}

export interface PracticesGetInterface {
  id?: string;
  name: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminContactNumber: string;
  status: string;
  code: string;
  dateCreated?: string;
  dateUpdated?: string;
}

export interface PracticesEditInterface {
  id?: string;
  name: string;
  status: string;
  code: string;
}
