import { IBaseEntity } from '../base.interface';
import { ITemplate } from '../index.browser';

export interface IEmailLog extends IBaseEntity {
  surgeryId: string;
  template?: ITemplate;
  status: string;
  data?: EmailData;
  response?: EmailResponse;
  expectedDate: Date;
  systemTemplateName?: string;
  isEval: boolean;
}

export interface EmailData {
  [key: string]: string;
}

export interface EmailResponse {
  statusCode: number;
  message: string;
}

export interface EmailVariables {
  fname: string;
  lname: string;
  mrn: string;
  pt_email_address: string;
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
}
