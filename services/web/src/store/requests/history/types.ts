export type HistoryPayload = {
  practiceId: string;
  page: number;
  limit: number;
  patientId?: string;
  surgery?: string;
};

export type GetHistoryPayload = HistoryPayload;
