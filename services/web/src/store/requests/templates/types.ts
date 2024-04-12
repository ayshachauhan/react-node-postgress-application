export interface DbTemplatesResponse {
  id: string;
  active: boolean;
  dateOffset?: string;
  meridiem: string;
  messageType: string;
  surgeryType: string;
  emailSubject?: string;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
  version: string;
}

export interface SurgeryType {
  id: string;
  practiceId: string;
  name: string;
}

export interface CreateTemplateResponse {
  practiceId: string;
  userId?: string;
  active: boolean;
  dateOffset?: string;
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

export interface EditTemplate {
  id: string;
  practiceId: string;
  userId: string;
  active: boolean;
  dateOffset?: string;
  meridiem?: string;
  messageType?: string;
  surgeryType?: SurgeryType;
  emailSubject?: string;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
}

export interface GetTemplatesResponse {
  surgeryType: SurgeryType;
  surgeryTypeName?: string;
  booking?: DbTemplatesResponse[];
  pcp?: DbTemplatesResponse[];
  preop?: DbTemplatesResponse[];
  postop?: DbTemplatesResponse[];
  referrer?: DbTemplatesResponse[];
  evaluation?: DbTemplatesResponse[];
}
