export interface User {
  id?: string;
  practiceId?: string;
  email: string;
  userName: string;
  designation: string;
  firstName: string;
  contactNumber: string;
  countryCode: string;
  lastName: string;
  fullName: string;
  url?: string;
  type: string;
  status: string;
  password?: string;
  dateCreated?: Date;
  dateUpdated?: Date;
  dateDeleted?: Date;
}
