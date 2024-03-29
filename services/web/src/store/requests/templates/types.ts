export interface GetTemplatesResponse {
  id: string;
  active: boolean;
  dateOffset: number;
  meridiem: string;
  messageType: string;
  surgeryType: string;
  surgeryNumber: number;
  emailSubject?: string;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
}

export interface CreateTemplateResponse {
  practiceId: string;
  userId: string;
  active: boolean;
  dateOffset: number;
  meridiem: string;
  messageType: string;
  surgeryType: string;
  surgeryNumber: number;
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
  dateOffset?: number;
  meridiem?: string;
  messageType?: string;
  surgeryType?: string;
  surgeryNumber?: number;
  emailSubject?: string;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
}
