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
