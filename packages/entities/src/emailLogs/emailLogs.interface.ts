import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';

export interface IEmailLog extends IBaseEntity {
  status: string;
  data?: EmailData;
  response?: EmailResponse;
  expectedDate: Date;
  practice: IPractice;
  attachment?: string;
}

export interface EmailData {
  [key: string]: string;
}

export interface EmailResponse {
  statusCode?: number;
  message: string;
}

export interface EmailVariables {
  fname: string;
  lname: string;
  mrn: string;
  pt_email_address: string;
  doc_email_address: string;
  doctorFirstname: string;
  doctorLastname: string;
  surgery_date: string;
  pt_email_notify: string;
  laterality: string;
  Laterality: string;
  surgery_type: string;
  pod1_location: string;
  cataract_variable: string;
  all_cases: string;
  all_cataract_dates: string;
  all_case_type: string;
  phoneNumber: string;
  practiceName: string;
  insuranceType: string;
  referrerFname?: string;
  referrerLname?: string;
  referrerEmail?: string;
  doctorPhoneNumber?: string;
}
