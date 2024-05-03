export type CalendarsPayload = {
  practiceId: string;
  surgeryTypeId?: string;
  userId: string;
};

export type GetCalendarsPayload = CalendarsPayload;

export type CreateCalendarPayload = {
  maxSlots: number;
  bookedSlots: number;
  date: Date;
} & Required<CalendarsPayload>;

export type GetCalendarByIdPayload = { id: string } & CalendarsPayload;

export type UpdateCalendarPayload = {
  maxSlots: number;
  bookedSlots: number;
  id: string;
} & CalendarsPayload;

export type UpdateCalendarsPayload = {
  practiceId: string;
  userId: string;
  data: {
    maxSlots: number;
    bookedSlots: number;
    id: string;
  }[];
};
