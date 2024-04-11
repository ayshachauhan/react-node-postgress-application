import { BaseEntity } from '../base.entity';
import { IPractice } from '../practice';
import { IUser } from '../user/user.interface';

export interface ITemplate extends BaseEntity {
  practice: IPractice;
  surgeon: IUser;
  active: boolean;
  messageType: TemplateMessageType;
  dateOffset: number;
  meridiem?: Meridiem;
  surgeryType: SurgeryType;
  surgeryNumber: number;
  emailSubject: string;
  emailBody: string;
  emailAttachment: string;
  email1stCataract: string;
  email2ndCataract: string;
  messageText: string;
  version: string;
}

export enum SurgeryType {
  YAG = 'YAG',
  LASIK = 'LASIK',
  CATARACT = 'CATARACT',
}

export enum TemplateMessageType {
  EVALUATION = 'evaluation',
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
