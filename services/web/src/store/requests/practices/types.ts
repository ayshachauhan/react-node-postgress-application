export interface PracticeCreateInterface {
  name: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminContactNumber: string;
  code: string;
  practiceImg?: File | null;
}

export interface PracticesGetInterface {
  id?: string;
  name: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminContactNumber: string;
  adminId: string;
  status: string;
  code: string;
  dateCreated?: string;
  dateUpdated?: string;
  imgUrl?: string;
}

export interface PracticesEditInterface {
  id?: string;
  name: string;
  status: string;
  code: string;
  imgUrl?: string;
  adminFirstName?: string;
  adminLastName?: string;
  adminContactNumber?: string;
  adminId?: string;
  practiceImg?: File | null;
}

export type UploadImgPayload = {
  practiceId: string;
  file: File;
};
