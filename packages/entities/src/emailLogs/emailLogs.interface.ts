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
