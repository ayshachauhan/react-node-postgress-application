export interface GetTemplatesResponse {
  actice: boolean;
  dateOffset: number;
  meridiem: string;
  messageType: string;
  surgeryType: string;
  surgeryNumber: number;
  emailSubject?: String;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
}

export interface CreateTemplateResponse {
  practiceId: String;
  userId: string;
  actice: boolean;
  dateOffset: number;
  meridiem: string;
  messageType: string;
  surgeryType: string;
  surgeryNumber: number;
  emailSubject?: String;
  emailBody?: string;
  emailAttachment?: string;
  email1stCataract?: string;
  email2ndCataract?: string;
  messageText?: string;
}
