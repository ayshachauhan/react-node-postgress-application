export type GetChatParams = {
  practiceId: string;
  patientId?: string;
  mrn?: string;
  answer?: string;
  all?: boolean;
};

export type GetMessageParams = {
  practiceId: string;
  patientId?: string;
  mrn?: string;
  email?: string;
  all?: boolean;
};
