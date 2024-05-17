import { IBaseEntity } from '../base.interface';
import { IPractice } from '../practice/practice.interface';

export interface IMessage extends IBaseEntity {
  practice: IPractice;
  emailStatus: string;
  emailType: string;
  emailDetail: string;
  firstName: string;
  lastName: string;
  mrn: string;
  caseId: string;
  emailOpen: boolean;
  emailSent: string;
  linkOpen: boolean;
  email: string;
  phone: string;
  subject: string;
  message: string;
  links: string;
  linksFull: string;
  signature: string;
  attachments: string;
  textBody: string;
  textStatus: string;
}

export type IMessageRequest = {
  practiceId: string;
  emailStatus: string;
  emailType: string;
  emailDetail: string;
  firstName: string;
  lastName: string;
  mrn: string;
  caseId: string;
  emailOpen: boolean;
  emailSent: string;
  linkOpen: boolean;
  email: string;
  phone: string;
  subject: string;
  message: string;
  links: string;
  linksFull: string;
  signature: string;
  attachments: string;
  textBody: string;
  textStatus: string;
};

export enum EmailStatus {
  SENT = 'sent',
  DRAFT = 'draft',
  QUEUE = 'queue',
  QUEUEPM = 'queuePM',
  NEEDREFERRERINFO = 'needReferrerInfo',
}

export enum EmailType {
  TIMED = 'timed',
  EVAL = 'eval',
  IMMEDIATE = 'immediate',
  REFERRER = 'referrer',
}

export enum TextStatus {
  QUEUE = 'queue',
  SENT = 'sent',
  FAIL = 'fail',
}
