export type ChatPayload = {
  practiceId: string;
};

export type FetchChatParams = {
  practiceId: string;
  patientId?: string;
  mrn?: string;
  answer?: string;
};

export type FetchMessageParams = {
  practiceId: string;
  email?: string;
  patientId?: string;
};
