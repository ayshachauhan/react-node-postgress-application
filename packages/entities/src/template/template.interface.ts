import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice';
import { ISurgeryType } from '../surgeryType';
import { IUser } from '../user/user.interface';

export interface ITemplate extends IBaseEntity {
  practice: IPractice;
  surgeon: IUser;
  active: boolean;
  messageType: TemplateMessageType;
  dateOffset: number;
  meridiem?: Meridiem;
  surgeryType: ISurgeryType;
  emailSubject: string;
  emailBody: string;
  emailAttachment: string;
  email1stCataract: string;
  email2ndCataract: string;
  messageText: string;
  version: string;
  surgeryTypeName?: string;
}

export enum TemplateMessageType {
  BOOKING = 'booking',
  REFERRER = 'referrer',
  PCP = 'pcp',
  PREOP = 'preop',
  POSTOP = 'postop',
}

export enum Meridiem {
  AM = 'AM',
  PM = 'PM',
}

export interface ITemplateRequest {
  practiceId: string;
  userId?: string;
  active: boolean;
  dateOffset?: number;
  meridiem?: string;
  messageType: string;
  surgeryTypeId: string;
  emailSubject?: string;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
}

export interface ITemplateUpdate {
  id: string;
  practiceId: string;
  userId: string;
  active: boolean;
  dateOffset?: number;
  meridiem?: string;
  messageType?: string;
  surgeryType?: ISurgeryType;
  emailSubject?: string;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
}

export interface GetTemplatesResponse {
  surgeryType: ISurgeryType;
  surgeryTypeName?: string;
  booking?: ITemplate[];
  pcp?: ITemplate[];
  preop?: ITemplate[];
  postop?: ITemplate[];
  referrer?: ITemplate[];
  evaluation?: ITemplate[];
}
