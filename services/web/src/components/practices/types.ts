export interface PracticeCreateInterface {
  name: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminContactNumber: string;
  physicianEmail: string;
  physicianContactNumber: string;
  status: string;
  code: string;
}

export interface PracticesGetInterface {
  id?: string;
  name: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminContactNumber: string;
  physicianEmail: string;
  physicianContactNumber: string;
  status: string;
  code: string;
  dateCreated?: string;
  dateUpdated?: string;
}

export interface PracticesEditInterface {
  name: string;
  status: string;
  code: string;
}
