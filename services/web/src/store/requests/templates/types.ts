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

export interface CreateTemplateResponse {
  practiceId: string;
  userId?: string;
  active: boolean;
  dateOffset?: string;
  meridiem?: string;
  messageType: string;
  surgeryType: string;
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
  surgeryType?: string;
  emailSubject?: string;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
}

export interface GetTemplatesResponse {
  surgeryType: string;
  booking?: DbTemplatesResponse[];
  pcp?: DbTemplatesResponse[];
  preop?: DbTemplatesResponse[];
  postop?: DbTemplatesResponse[];
  referrer?: DbTemplatesResponse[];
  evaluation?: DbTemplatesResponse[];
}
