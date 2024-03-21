export interface User {
  id?: string;
  practiceId?: string;
  email: string;
  userName: string;
  firstName: string;
  contactNumber: string;
  lastName: string;
  fullName: string;
  url?: string;
  type: string;
  status: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  dateDeleted?: Date;
}
