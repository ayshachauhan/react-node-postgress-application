export type ChatPayload = {
  practiceId: string;
};

export type FetchChatParams = {
  practiceId: string;
  patientId?: string;
  mrn?: string;
  answer?: string;
};
